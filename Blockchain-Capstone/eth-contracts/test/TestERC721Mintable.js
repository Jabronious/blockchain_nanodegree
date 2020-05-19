var ERC721MintableComplete = artifacts.require('UdacityERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const testingId = 436636;

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, testingId, {from: account_one});
            await this.contract.mint(account_two, 52435, {from: account_one});
            await this.contract.mint(account_two, 6555, {from: account_one});
            await this.contract.mint(account_three, 123, {from: account_one});
        });

        it('should return total supply', async function () { 
            const supply = await this.contract.totalSupply();

            assert.equal(supply, 4);
        });

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf(account_two);

            assert.equal(balance, 3)
        })

        // // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const actualTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/' + testingId;
            const receivedTokenURI = await this.contract.tokenURI(testingId);

            assert.equal(actualTokenURI, receivedTokenURI);
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.approve(account_three, testingId, {from: account_two});
            await this.contract.transferFrom(account_two, account_three, testingId, {from: account_two});

            const tokenOwner = await this.contract.ownerOf(testingId);
            assert.equal(tokenOwner, account_three)
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let error;
            try {
                await this.contract.mint(account_two, testingId, {from: account_three});
            } catch (err) {
                error = err;
            }

            assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert Must be the owner -- Reason given: Must be the owner.');
        })

        it('should return contract owner', async function () { 
            const contractOwner = await this.contract.owner({from: account_one});

            assert.equal(contractOwner, account_one);
        })

    });
})