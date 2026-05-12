// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Vyron Coin
 * @dev Implementation of the Vyron Coin (VYR).
 * Features: ERC20, Burnable, Pausable, Ownable
 */
contract VyronCoin is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    
    // Events for admin actions
    event AdminMint(address indexed to, uint256 amount);
    event ContractPaused(address account);
    event ContractUnpaused(address account);

    constructor(address initialOwner)
        ERC20("Vyron Coin", "VYR")
        Ownable(initialOwner)
    {
        // Initial supply of 1,000,000 VYR (with 18 decimals)
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Pauses all token transfers.
     * Can only be called by the owner.
     */
    function pause() public onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /**
     * @dev Unpauses all token transfers.
     * Can only be called by the owner.
     */
    function unpause() public onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    /**
     * @dev Mints new tokens.
     * Can only be called by the owner.
     * @param to The address to receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit AdminMint(to, amount);
    }

    // Required override to update state with Pausable
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
