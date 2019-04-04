pragma solidity 0.5.0;

//code taken from https://theethereum.wiki/w/index.php/ERC20_Token_Standard
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

//code taken from https://theethereum.wiki/w/index.php/ERC20_Token_Standard
contract ERC20{

    using SafeMath for uint;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    address public owner;
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowed;

    constructor(uint supply) public {
        owner = msg.sender;
        symbol = "FIXED";
        name = "Example Fixed Supply Token";
        decimals = 18;
        _totalSupply = supply;
        balances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
    }
    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) public returns (bool success) {
        // balances[msg.sender] = balances[msg.sender]-tokens;//balances[msg.sender].sub(tokens);
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        // balances[to] = balances[to] + tokens;
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        require(allowed[from][to] >= tokens);
        // balances[from] = balances[from] - tokens;
        balances[from] = balances[from].sub(tokens);
        // allowed[from][msg.sender] = allowed[from][msg.sender] - tokens;
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        // balances[to] = balances[to] + tokens;
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
}