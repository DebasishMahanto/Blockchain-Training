// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IERC1155Receiver.sol";

interface IERC1155 {
    event TransferSingle(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256 _id,
        uint256 _value
    );

    event TransferBatch(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256[] _ids,
        uint256[] _values
    );

    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external;

    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external;

    function balanceOf(address _owner, uint256 _id)
        external
        view
        returns (uint256);

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
        external
        view
        returns (uint256[] memory);

    function setApprovalForAll(address _operator, bool _approved) external;

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);
}

contract ERC1155 is IERC1155, IERC1155Receiver {
    // token id => (address => balance)
    mapping(uint256 => mapping(address => uint256)) internal _balances;
    // owner => (operator => yes/no)
    mapping(address => mapping(address => bool)) internal _operatorApprovals;
    // token id => supply
    mapping(uint256 => uint256) public totalSupply;

    uint256 public tokenId;
    string public name;
    string public symbol;
    address public owner;

    constructor(string memory _name, string memory _symbol) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        tokenId = 1;
    }

    function balanceOf(address _owner, uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        require(_owner != address(0), "ERC1155: invalid address");
        return _balances[_tokenId][_owner];
    }

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
        public
        view
        returns (uint256[] memory)
    {
        require(
            _owners.length == _ids.length,
            "ERC1155: accounts and ids length mismatch"
        );
        uint256[] memory balances = new uint256[](_owners.length);

        for (uint256 i = 0; i < _owners.length; i++) {
            balances[i] = balanceOf(_owners[i], _ids[i]);
        }

        return balances;
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        _operatorApprovals[msg.sender][_operator] = _approved;
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[_owner][_operator];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external {
        require(
            _to != address(0),
            "IERC1155: Receiver address can not be zero"
        );
        require(_value > 0, "IERC1155: value should something");
        require(
            _from == msg.sender || isApprovedForAll(_from, msg.sender),
            "ERC1155: not authorized"
        );
        uint256[] memory ids = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        ids[0] = _id;
        amounts[0] = _value;
        _transfer(_from, _to, ids, amounts);
        emit TransferSingle(msg.sender, _from, _to, _id, _value);
        _doSafeTransferAcceptanceCheck(
            msg.sender,
            _from,
            _to,
            _id,
            _value,
            _data
        );
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external {
        require(
            ids.length == amounts.length,
            "ERC1155: id and amount length mismatch"
        );
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not token owner or approved"
        );
        require(to != address(0), "ERC1155: transfer to zero address");
        for (uint256 index = 0; index < ids.length; index++) {
            require(amounts[index] > 0, "ERC1155: amount can't be zero");
            if (_balances[ids[index]][from] < amounts[index])
                revert("ERC1155: insufficient balance");

            _balances[ids[index]][from] -= amounts[index];
            _balances[ids[index]][to] += amounts[index];
            _doSafeTransferAcceptanceCheck(
                msg.sender,
                from,
                to,
                ids[index],
                amounts[index],
                data
            );
        }
        emit TransferBatch(msg.sender, from, to, ids, amounts);
    }

    function mintTo(
        address _to,
        uint256 _tokenId,
        uint256 _amount
    ) public {
        require(owner == msg.sender, "ERC1155: not authorized");
        require(_to!=address(0),"ERC1155: invalid mint address");
        require(_amount>0,"ERC1155: amount invalid");
        require(_tokenId>0,"ERC1155: invalid tokenId");

        uint256 tokenIdToMint;

        if (_tokenId > tokenId) {
            tokenIdToMint = tokenId;
            tokenId += 1;
        } else {
            tokenIdToMint = _tokenId;
        }

        _balances[tokenIdToMint][_to] += _amount;
        totalSupply[tokenIdToMint] += _amount;

        emit TransferSingle(msg.sender, address(0), _to, _tokenId, _amount);
    }

    function _transfer(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) internal {
        require(_to != address(0), "IERC1155: transfer to address 0");

        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 id = _ids[i];
            uint256 amount = _amounts[i];

            uint256 fromBalance = _balances[id][_from];
            require(
                fromBalance >= amount,
                "IERC1155: insufficient balance for transfer"
            );
            _balances[id][_from] -= amount;
            _balances[id][_to] += amount;
        }
    }

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.code.length > 0) {
            if (
                IERC1155Receiver(to).onERC1155Received(
                    operator,
                    from,
                    to,
                    id,
                    amount,
                    data
                ) != IERC1155Receiver.onERC1155Received.selector
            ) {
                revert("ERC1155: unsafe recevier address");
            }
        }
    }

    function onERC1155Received(
        address,
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address, address, address, uint256, uint256, bytes)"
                )
            );
    }
}
