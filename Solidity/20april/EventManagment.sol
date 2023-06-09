// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Events {
    address organizer;
    string eventName;
    uint256 eventDate;
    uint256 ticketPrice;
    uint256 totalTicket;
    uint256 remainingTicket;
}

contract EventContract {
    mapping(uint256 => Events) public events;
    mapping(address => mapping(uint256 => uint256)) public tickets;

    uint256 public key = 1;
    address owner;
 
    constructor() {
        owner = msg.sender;
    }

    function createEvents(
        string memory _eventName,
        uint256 _eventDate,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external {
        require(_eventDate > block.timestamp, "EventContract: date expired");
        require(_ticketPrice > 0, "EventContract: ticket price can't zero");
        require(_totalTickets > 0, "EventContract: total ticket can't zero");
        events[key] = Events(
            msg.sender,
            _eventName,
            _eventDate,
            _ticketPrice,
            _totalTickets,
            _totalTickets
        );
        key++;
    }

    function bookTickets(uint256 _eventKey, uint256 _quantity)
        external
        payable
    {
        Events storage _event = events[_eventKey];

        require(
            _event.eventDate > block.timestamp,
            "EventContract: Event not found"
        );
        require(
            _event.remainingTicket >= _quantity,
            "EventContract: tickets not available"
        );
        if (owner == msg.sender) {
            _event.remainingTicket -= _quantity;
            tickets[msg.sender][_eventKey] += _quantity;
        } else {
            require(
                msg.value >= _event.ticketPrice * _quantity,
                "EventContract: need more crypto"
            );
            _event.remainingTicket -= _quantity;
            tickets[msg.sender][_eventKey] += _quantity;
        }
    }

    function tranferTickets(
        uint256 _eventID,
        address _receiver,
        uint256 _quantity
    ) external {
        require(
            events[_eventID].eventDate > block.timestamp,
            "EventContract: Event not found"
        );
        require(
            tickets[msg.sender][_eventID] >= _quantity,
            "EventContract: you dont have that much ticket"
        );
        tickets[_receiver][_eventID] += _quantity;
        tickets[msg.sender][_eventID] -= _quantity;
    }

    function cancelTickets(uint256 _eventID, uint256 _quantity)
        external
        payable
    {
        require(
            tickets[msg.sender][_eventID] >= _quantity,
            "EventContract: you dont have that much tickets"
        );
        require(
            events[_eventID].eventDate > block.timestamp,
            "EventContract: Event not found"
        );

        events[_eventID].remainingTicket += _quantity;
        tickets[msg.sender][_eventID] -= _quantity;

        if (msg.sender != owner) {
            payable(msg.sender).transfer(
                events[_eventID].ticketPrice * _quantity
            );
        }
    }
}

//etherium standard
