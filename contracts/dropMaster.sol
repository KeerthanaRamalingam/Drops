// SPDX-License-Identifier: UNLICENSED

import "./limitedCollection.sol";

pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;


contract DropMaster is 
    Initializable,
    Ownable  {
    address payable treasury;

    struct collectionInfo {
        // the collection name
        string name;
        // the collection symbol
        string symbol;
        // the collection quantity
        uint256 quantity;
        // the collection startDate
        uint256 startDate;
        // the collection endDate
        uint256 endDate;
        //whiteList status
        bool whiteList;
        // the contract address
        address myContract;
    }

    /**
     * @notice Called once to configure the contract after the initial deployment.
     * @dev This farms the initialize call out to inherited contracts as needed.
     */
    function initialize(
        address payable _treasury
    ) public initializer {
        Ownable.ownable_init();
        treasury = _treasury;
    }


    // collection info mapping
    mapping(address => mapping(string => collectionInfo)) public collections;
    // get collection
    mapping(address => mapping(string => address)) public getCollection;
    mapping(address => string) public getCode;

    event CollectionCreated(
        address creator,
        string colCode,
        string colName,
        address myContract,
        uint256 quantity,
        uint256 startDate,
        uint256 endDate,
        bool whiteListed
    );

    function createCollection(
        string memory _colCode,
        string memory _colName,
        uint256 _colQuantity,
        uint256 _startDate,
        uint256 _endDate,
        bool _whiteList
    ) onlyOwner
        external
        returns (address collection)
    {
        require(
            getCollection[msg.sender][_colCode] == address(0),
            "DropMaster : COLLECTION_EXISTS"
        );

        bytes memory bytecode = type(DropsCollection).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _colCode));

        assembly {
            collection := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        getCollection[msg.sender][_colCode] = collection;
        getCode[collection] = _colCode;
        DropsCollection(collection).initialize(
            treasury,
            _colName,
            _colCode,
            _colQuantity,
            _startDate,
            _endDate,
            _whiteList
        );
        DropsCollection(collection).adminUpdateConfig("https://ipfs.io/ipfs/");
        collections[msg.sender][_colCode] = collectionInfo({
            name: _colName,
            symbol: _colCode,
            quantity: _colQuantity,
            startDate: _startDate,
            endDate: _endDate,
            whiteList: _whiteList,
            myContract: collection
        });

        emit CollectionCreated(
            msg.sender,
            _colCode,
            _colName,
            collection,
            _colQuantity,
            _startDate,
            _endDate,
            _whiteList
        );
    }


    function getCollectionDetails(address user, string memory _code)
        public
        view
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        collectionInfo memory collection = collections[user][_code];
        return (
            collection.name,
            collection.symbol,
            collection.quantity
        );
    }
}