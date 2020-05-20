// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const SquareVerifier = artifacts.require("SquareVerifier");

contract("SolnSquareVerifier", accounts => {
	const zokratesProof = require("../../zokrates/code/square/proof.json");
    const proof = zokratesProof.proof;
	const inputs = zokratesProof.inputs;

    const account_one = accounts[0];
    const account_two = accounts[1];

    before(async () => {
        this.verifier = await SquareVerifier.new({from: account_one});
        this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: account_one});
    });

    it("should allow for a new token to be minted", async () => {
    	const mintedToken = await this.contract.mintNewToken(
    		account_two,
			4325,
			proof.a,
        	proof.b,
        	proof.c,
        	inputs
    	)

        assert(mintedToken);
    });
});