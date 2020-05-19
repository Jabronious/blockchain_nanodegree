pragma solidity >=0.4.21 <0.6.0;

import "./SquareVerifier.sol";
import "./ERC721Mintable.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier is SquareVerifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is UdacityERC721Token {
	Verifier verifierContract;

	constructor(address verifierAddress) UdacityERC721Token() public {
        verifierContract = Verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct SolutionStruct {
    	uint index;
    	address to;
    }

    // TODO define an array of the above struct
    SolutionStruct[] SolutionStructArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => SolutionStruct) private submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event AddedSolution(uint256 index, address to, bytes32 solutionKey);

    // TODO Create a function to add the solutions to the array and emit the event
    function AddSolutionToArray(address _to, uint256 _index, bytes32 solutionKey) public {
    	SolutionStruct memory solution = SolutionStruct({ index: _index, to: _to });
    	
    	SolutionStructArray.push(solution);
    	submittedSolutions[solutionKey] = solution;

    	emit AddedSolution(_index, _to, solutionKey);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
	//  - make sure the solution is unique (has not been used before)
	//  - make sure you handle metadata as well as tokenSuplly
	function mintNewToken(
		address to,
		uint256 tokenId,
		uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public onlyOwner returns (bool) {
    	require(verifierContract.verifyTx(a, b, c, input), 'invalid solution');
		bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
		require(submittedSolutions[key].to == address(0), 'this solution has already been used');

		AddSolutionToArray(to, tokenId, key);

		super.mint(to, tokenId);
    }
}

  


























