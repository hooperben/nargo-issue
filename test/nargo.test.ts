import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { resolve } from "path";
import { CompiledCircuit } from "@noir-lang/types";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";

import { ethers } from "hardhat";

const getCircuit = async () => {
  const basePath = resolve("./circuits/");
  const fm = createFileManager(basePath);
  const result = await compile(fm);
  if (!("program" in result)) {
    throw new Error("Compilation failed");
  }
  return result.program as CompiledCircuit;
};

describe("Testing Nargo", function () {
  it.only("should let me prove circuit", async () => {
    const circuit = await getCircuit();

    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);

    // next, we deploy our prover contract
    const UltraVerifier = await ethers.getContractFactory("UltraVerifier");
    const ultraVerifier = await UltraVerifier.deploy();
    await ultraVerifier.waitForDeployment();

    const proof = await noir.generateProof({ x: 1, y: 2 });

    // proof is valid
    console.log(proof);

    // now call the contract - but this will fail
    await ultraVerifier.verify(proof.proof, proof.publicInputs);

    console.log("works"); // doesn't actually work
  });
});
