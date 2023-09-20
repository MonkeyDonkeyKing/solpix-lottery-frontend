export type SolpixLottery = {
  "version": "0.1.0",
  "name": "solpix_lottery",
  "instructions": [
    {
      "name": "initializeProgramManager",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManagerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateProgramManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeLotteryManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assignee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitLotteryManagerParams"
          }
        }
      ]
    },
    {
      "name": "updateLotteryManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateLotteryManagerParams"
          }
        }
      ]
    },
    {
      "name": "initializeLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "This is the authority of the lottery manager"
          ]
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateLotteryConceptParams"
          }
        }
      ]
    },
    {
      "name": "updateLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "This is the authority of the lottery manager"
          ]
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "This is the lottery that is being updated"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateLotteryParams"
          }
        }
      ]
    },
    {
      "name": "addNftPrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addPoolPrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prize",
          "type": {
            "defined": "Prize"
          }
        }
      ]
    },
    {
      "name": "removePrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "prizeVaultAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "authorityAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prize",
          "type": {
            "defined": "Prize"
          }
        }
      ]
    },
    {
      "name": "cancelConcept",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "StartLotteryParams"
          }
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "drawWinners",
      "accounts": [
        {
          "name": "lotteryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyWinner",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cleanupWinners",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelFailedLottery",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryTicketMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lottery",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "associatedLotteryManager",
            "docs": [
              "points to the authority Pubkey of the lottery manager"
            ],
            "type": "publicKey"
          },
          {
            "name": "lotteryId",
            "docs": [
              "derived from the lottery manager data"
            ],
            "type": "u32"
          },
          {
            "name": "lotteryType",
            "docs": [
              "Cappep[0] = lottery ends when max tickets are sold and can be cancelled after a specific time if the cap is not hit",
              "Time[1] = lottery ends at a specific time if min tickets are sold"
            ],
            "type": {
              "defined": "LotteryType"
            }
          },
          {
            "name": "lotteryStatus",
            "docs": [
              "Concepting[0] = lottery is being created and can be updated \\\\\\",
              "Live[1] = lottery is live and tickets can be bought \\\\\\",
              "Drawing[2] = lottery is closed and winners are being drawn \\\\\\",
              "Claim[3] = lottery is closed and winners can claim their prizes \\\\\\",
              "Finalized[4] = lottery is closed and winners have claimed their prizes \\\\\\",
              "Canceled[5] = lottery is canceled and all participants can reclaim their funds \\\\"
            ],
            "type": {
              "defined": "LotteryStatus"
            }
          },
          {
            "name": "ticketPrice",
            "docs": [
              "Sol[0] = ticket price is in sol \\\\\\",
              "Spl[1] = ticket price is in spl | TODO: This is not yet implemented"
            ],
            "type": {
              "defined": "TicketPrice"
            }
          },
          {
            "name": "maxTicketsForSale",
            "docs": [
              "the maximum number of tickets that can be sold",
              "## IMPORTANT:",
              "#LotteryType::Capped { max_tickets_for_sale === the cap} \\\\\\",
              "#LotteryType::Time { required_min_tickets_sold cannot be less then max_tickets_for_sale }"
            ],
            "type": "u32"
          },
          {
            "name": "ticketsSold",
            "docs": [
              "the next ticket id to be sold \\\\\\",
              "## Options:",
              "1. this value is incremented every time a ticket is sold and cannot ever exceed max_tickets_for_sale",
              "2."
            ],
            "type": "u32"
          },
          {
            "name": "winningTickets",
            "docs": [
              "the winning tickets of the lottery",
              "## IMPORTANT FOR DRAWING STAGE:",
              "1. This vector should be empty when the lottery is created and should only be populated when the lottery is in the drawing stage",
              "2. This vector should only be populated with tickets that have been sold",
              "And when the drawing stage is over its length should be equal to the length of the prizes vector",
              "## IMPORTANT FOR CLAIM STAGE:",
              "Flick switch the claimed value of the winning ticket to true when the winner claims their prize"
            ],
            "type": {
              "vec": {
                "defined": "Winner"
              }
            }
          },
          {
            "name": "prizes",
            "docs": [
              "the prizes of the lottery",
              "## IMPORTANT:",
              "This vector should be populated when the lottery is in concepting stage and can not be mutated after"
            ],
            "type": {
              "vec": {
                "defined": "Prize"
              }
            }
          }
        ]
      }
    },
    {
      "name": "lotteryManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "refers to the user that was assigned the authority of the lottery manager\\\\\\",
              "The Lottery Manager pda is derived from this MemLocation \\\\\\"
            ],
            "type": "publicKey"
          },
          {
            "name": "nextLotteryId",
            "docs": [
              "the next lottery id to be created",
              "## IMPORTANT:",
              "This value is incremented every time a lottery is created"
            ],
            "type": "u32"
          },
          {
            "name": "allowance",
            "docs": [
              "the number of lotteries that can be created by the lottery manager",
              "## IMPORTANT:",
              "This value is decremented every time a lottery is created"
            ],
            "type": "u32"
          },
          {
            "name": "programManagerCommission",
            "docs": [
              "The commisionrate that goes to the program manager"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programManager",
      "docs": [
        "The program manager is the user that is allowed to create lottery managers"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "refers to the user that was assigned the authority of the program manager"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StartLotteryParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "UpdateLotteryParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lotteryType",
            "type": {
              "option": {
                "defined": "LotteryType"
              }
            }
          },
          {
            "name": "ticketPrice",
            "type": {
              "option": {
                "defined": "TicketPrice"
              }
            }
          },
          {
            "name": "maxTicketsForSale",
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "Winner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ticketId",
            "type": "u32"
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "verified",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "CreateLotteryConceptParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lotteryType",
            "type": {
              "defined": "LotteryType"
            }
          },
          {
            "name": "ticketPrice",
            "type": {
              "defined": "TicketPrice"
            }
          },
          {
            "name": "maxTicketsForSale",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "UpdateLotteryManagerParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowance",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "programManagerCommission",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "InitLotteryManagerParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowance",
            "type": "u32"
          },
          {
            "name": "programManagerCommission",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LotteryType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Capped",
            "fields": [
              {
                "name": "auto_announce_winners_after",
                "docs": [
                  "If the cap is hit The lottery manager has the option to draw the winners at any time up until this time"
                ],
                "type": "i64"
              }
            ]
          },
          {
            "name": "Time",
            "fields": [
              {
                "name": "end_time",
                "docs": [
                  "the lottery ends at this time"
                ],
                "type": "i64"
              },
              {
                "name": "required_min_tickets_sold",
                "docs": [
                  "the lottery will be cancelled if this many tickets are not sold by the end_time"
                ],
                "type": "u32"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "LotteryStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Concepting"
          },
          {
            "name": "Live"
          },
          {
            "name": "Drawing",
            "fields": [
              {
                "name": "status",
                "type": {
                  "defined": "DrawingStatus"
                }
              }
            ]
          },
          {
            "name": "Claim"
          },
          {
            "name": "Finalized"
          },
          {
            "name": "Canceled",
            "fields": [
              {
                "name": "status",
                "type": {
                  "defined": "CancelStatus"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "DrawingStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InProgress",
            "fields": [
              {
                "name": "index",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Incomplete",
            "fields": [
              {
                "name": "cleaned",
                "type": "bool"
              }
            ]
          },
          {
            "name": "Done"
          }
        ]
      }
    },
    {
      "name": "CancelStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Refunding",
            "fields": [
              {
                "name": "tickets",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Done"
          }
        ]
      }
    },
    {
      "name": "Prize",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pool",
            "fields": [
              {
                "name": "value",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Nft",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Sft",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          },
          {
            "name": "Spl",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "TicketPrice",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Sol",
            "fields": [
              {
                "name": "value",
                "type": "u64"
              }
            ]
          },
          {
            "name": "Spl",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LotteryConceptingError",
      "msg": "Lottery is not in concepting stage"
    },
    {
      "code": 6001,
      "name": "LotteryLiveError",
      "msg": "Lottery is not live"
    },
    {
      "code": 6002,
      "name": "LotteryDrawingError",
      "msg": "Lottery is not in drawing stage"
    },
    {
      "code": 6003,
      "name": "LotteryClaimError",
      "msg": "Lottery is not in claim stage"
    },
    {
      "code": 6004,
      "name": "LotteryNotOverError",
      "msg": "Lottery is not over yet"
    },
    {
      "code": 6005,
      "name": "LotteryNotConceptingOrLiveError",
      "msg": "Lottery is not in concepting or live stage"
    },
    {
      "code": 6006,
      "name": "MaxTicketSaleError",
      "msg": "Cannot sell ticket due to max tickets for sale being reached"
    },
    {
      "code": 6007,
      "name": "TicketNotFoundError",
      "msg": "Ticket not found or already claimed"
    },
    {
      "code": 6008,
      "name": "PrizeRemovalError",
      "msg": "Error removing prize from lottery"
    },
    {
      "code": 6009,
      "name": "WinnersClaimStatusError",
      "msg": "Not all winners have claimed their prizes"
    },
    {
      "code": 6010,
      "name": "DuplicateNFTMintError",
      "msg": "Duplicate NFT mint found in prizes vector"
    },
    {
      "code": 6011,
      "name": "UnsupportedPrizeTypeSftError",
      "msg": "SFT not yet implemented"
    },
    {
      "code": 6012,
      "name": "UnsupportedPrizeTypeSplError",
      "msg": "Spl not yet implemented"
    },
    {
      "code": 6013,
      "name": "NotPoolPrizeError",
      "msg": "not a pool prize"
    },
    {
      "code": 6014,
      "name": "NotNftPrizeError",
      "msg": "not a nft prize"
    },
    {
      "code": 6015,
      "name": "OutOfBoundsError",
      "msg": "Index out of bounds"
    },
    {
      "code": 6016,
      "name": "EmptyPrizeError",
      "msg": "Can't start a lottery without prizes"
    },
    {
      "code": 6017,
      "name": "TicketSaleBalanceError",
      "msg": "required_min_tickets_sold cannot be greater then max_tickets_for_sale"
    },
    {
      "code": 6018,
      "name": "EligibilityError",
      "msg": "We have hit the eligibility to draw winners thus we can not cancel"
    },
    {
      "code": 6019,
      "name": "ExcessiveTicketPriceError",
      "msg": "format"
    },
    {
      "code": 6020,
      "name": "AnnouncementTimingError",
      "msg": "auto_announce_winners_after cannot be less then current_time"
    },
    {
      "code": 6021,
      "name": "EndTimeTimingError",
      "msg": "end_time cannot be less then current_time"
    },
    {
      "code": 6022,
      "name": "CancelationTimingErrorAutoAnnounce",
      "msg": "Cannot cancel if we are not yet at the auto_announce_winners_after time"
    },
    {
      "code": 6023,
      "name": "CancelationTimingErrorEndTime",
      "msg": "Cannot cancel if not at the end time"
    },
    {
      "code": 6024,
      "name": "ProgramManagerSignerError",
      "msg": "Program Manager is not the signer"
    },
    {
      "code": 6025,
      "name": "ProgramManagerSameError",
      "msg": "New Program Manager is same as old Program Manager"
    },
    {
      "code": 6026,
      "name": "LotteryManagerSignerError",
      "msg": "Lottery Manager is not the signer"
    },
    {
      "code": 6027,
      "name": "LotteryManagerAllowanceError",
      "msg": "Allowance cannot be less then 0"
    },
    {
      "code": 6028,
      "name": "ImpossibleError",
      "msg": "This error should not even be possible but well done"
    },
    {
      "code": 6029,
      "name": "TicketSaleRequirementError",
      "msg": "Not enough tickets sold"
    },
    {
      "code": 6030,
      "name": "PrematureWinnersAnnouncementError",
      "msg": "Winners cannot be announced yet"
    },
    {
      "code": 6031,
      "name": "ProgramManagerAuthorityError",
      "msg": "Program manager authority is not authority of this lottery"
    },
    {
      "code": 6032,
      "name": "LotteryManagerAuthorityError",
      "msg": "Lottery manager authority is not authority of this lottery"
    },
    {
      "code": 6033,
      "name": "TODO",
      "msg": "TODO"
    }
  ]
};

export const IDL: SolpixLottery = {
  "version": "0.1.0",
  "name": "solpix_lottery",
  "instructions": [
    {
      "name": "initializeProgramManager",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManagerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateProgramManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeLotteryManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assignee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitLotteryManagerParams"
          }
        }
      ]
    },
    {
      "name": "updateLotteryManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateLotteryManagerParams"
          }
        }
      ]
    },
    {
      "name": "initializeLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "This is the authority of the lottery manager"
          ]
        },
        {
          "name": "lotteryManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateLotteryConceptParams"
          }
        }
      ]
    },
    {
      "name": "updateLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "This is the authority of the lottery manager"
          ]
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "This is the lottery that is being updated"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateLotteryParams"
          }
        }
      ]
    },
    {
      "name": "addNftPrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addPoolPrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prize",
          "type": {
            "defined": "Prize"
          }
        }
      ]
    },
    {
      "name": "removePrize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "prizeVaultAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "authorityAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prize",
          "type": {
            "defined": "Prize"
          }
        }
      ]
    },
    {
      "name": "cancelConcept",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startLottery",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lotteryManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "StartLotteryParams"
          }
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "drawWinners",
      "accounts": [
        {
          "name": "lotteryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyWinner",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cleanupWinners",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelFailedLottery",
      "accounts": [
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryTicketMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lotteryPdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "prizeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiverAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lottery",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "associatedLotteryManager",
            "docs": [
              "points to the authority Pubkey of the lottery manager"
            ],
            "type": "publicKey"
          },
          {
            "name": "lotteryId",
            "docs": [
              "derived from the lottery manager data"
            ],
            "type": "u32"
          },
          {
            "name": "lotteryType",
            "docs": [
              "Cappep[0] = lottery ends when max tickets are sold and can be cancelled after a specific time if the cap is not hit",
              "Time[1] = lottery ends at a specific time if min tickets are sold"
            ],
            "type": {
              "defined": "LotteryType"
            }
          },
          {
            "name": "lotteryStatus",
            "docs": [
              "Concepting[0] = lottery is being created and can be updated \\\\\\",
              "Live[1] = lottery is live and tickets can be bought \\\\\\",
              "Drawing[2] = lottery is closed and winners are being drawn \\\\\\",
              "Claim[3] = lottery is closed and winners can claim their prizes \\\\\\",
              "Finalized[4] = lottery is closed and winners have claimed their prizes \\\\\\",
              "Canceled[5] = lottery is canceled and all participants can reclaim their funds \\\\"
            ],
            "type": {
              "defined": "LotteryStatus"
            }
          },
          {
            "name": "ticketPrice",
            "docs": [
              "Sol[0] = ticket price is in sol \\\\\\",
              "Spl[1] = ticket price is in spl | TODO: This is not yet implemented"
            ],
            "type": {
              "defined": "TicketPrice"
            }
          },
          {
            "name": "maxTicketsForSale",
            "docs": [
              "the maximum number of tickets that can be sold",
              "## IMPORTANT:",
              "#LotteryType::Capped { max_tickets_for_sale === the cap} \\\\\\",
              "#LotteryType::Time { required_min_tickets_sold cannot be less then max_tickets_for_sale }"
            ],
            "type": "u32"
          },
          {
            "name": "ticketsSold",
            "docs": [
              "the next ticket id to be sold \\\\\\",
              "## Options:",
              "1. this value is incremented every time a ticket is sold and cannot ever exceed max_tickets_for_sale",
              "2."
            ],
            "type": "u32"
          },
          {
            "name": "winningTickets",
            "docs": [
              "the winning tickets of the lottery",
              "## IMPORTANT FOR DRAWING STAGE:",
              "1. This vector should be empty when the lottery is created and should only be populated when the lottery is in the drawing stage",
              "2. This vector should only be populated with tickets that have been sold",
              "And when the drawing stage is over its length should be equal to the length of the prizes vector",
              "## IMPORTANT FOR CLAIM STAGE:",
              "Flick switch the claimed value of the winning ticket to true when the winner claims their prize"
            ],
            "type": {
              "vec": {
                "defined": "Winner"
              }
            }
          },
          {
            "name": "prizes",
            "docs": [
              "the prizes of the lottery",
              "## IMPORTANT:",
              "This vector should be populated when the lottery is in concepting stage and can not be mutated after"
            ],
            "type": {
              "vec": {
                "defined": "Prize"
              }
            }
          }
        ]
      }
    },
    {
      "name": "lotteryManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "refers to the user that was assigned the authority of the lottery manager\\\\\\",
              "The Lottery Manager pda is derived from this MemLocation \\\\\\"
            ],
            "type": "publicKey"
          },
          {
            "name": "nextLotteryId",
            "docs": [
              "the next lottery id to be created",
              "## IMPORTANT:",
              "This value is incremented every time a lottery is created"
            ],
            "type": "u32"
          },
          {
            "name": "allowance",
            "docs": [
              "the number of lotteries that can be created by the lottery manager",
              "## IMPORTANT:",
              "This value is decremented every time a lottery is created"
            ],
            "type": "u32"
          },
          {
            "name": "programManagerCommission",
            "docs": [
              "The commisionrate that goes to the program manager"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programManager",
      "docs": [
        "The program manager is the user that is allowed to create lottery managers"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "refers to the user that was assigned the authority of the program manager"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StartLotteryParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "UpdateLotteryParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lotteryType",
            "type": {
              "option": {
                "defined": "LotteryType"
              }
            }
          },
          {
            "name": "ticketPrice",
            "type": {
              "option": {
                "defined": "TicketPrice"
              }
            }
          },
          {
            "name": "maxTicketsForSale",
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "Winner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ticketId",
            "type": "u32"
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "verified",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "CreateLotteryConceptParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lotteryType",
            "type": {
              "defined": "LotteryType"
            }
          },
          {
            "name": "ticketPrice",
            "type": {
              "defined": "TicketPrice"
            }
          },
          {
            "name": "maxTicketsForSale",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "UpdateLotteryManagerParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowance",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "programManagerCommission",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "InitLotteryManagerParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowance",
            "type": "u32"
          },
          {
            "name": "programManagerCommission",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LotteryType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Capped",
            "fields": [
              {
                "name": "auto_announce_winners_after",
                "docs": [
                  "If the cap is hit The lottery manager has the option to draw the winners at any time up until this time"
                ],
                "type": "i64"
              }
            ]
          },
          {
            "name": "Time",
            "fields": [
              {
                "name": "end_time",
                "docs": [
                  "the lottery ends at this time"
                ],
                "type": "i64"
              },
              {
                "name": "required_min_tickets_sold",
                "docs": [
                  "the lottery will be cancelled if this many tickets are not sold by the end_time"
                ],
                "type": "u32"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "LotteryStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Concepting"
          },
          {
            "name": "Live"
          },
          {
            "name": "Drawing",
            "fields": [
              {
                "name": "status",
                "type": {
                  "defined": "DrawingStatus"
                }
              }
            ]
          },
          {
            "name": "Claim"
          },
          {
            "name": "Finalized"
          },
          {
            "name": "Canceled",
            "fields": [
              {
                "name": "status",
                "type": {
                  "defined": "CancelStatus"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "DrawingStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InProgress",
            "fields": [
              {
                "name": "index",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Incomplete",
            "fields": [
              {
                "name": "cleaned",
                "type": "bool"
              }
            ]
          },
          {
            "name": "Done"
          }
        ]
      }
    },
    {
      "name": "CancelStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Refunding",
            "fields": [
              {
                "name": "tickets",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Done"
          }
        ]
      }
    },
    {
      "name": "Prize",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pool",
            "fields": [
              {
                "name": "value",
                "type": "u32"
              }
            ]
          },
          {
            "name": "Nft",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Sft",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          },
          {
            "name": "Spl",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "TicketPrice",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Sol",
            "fields": [
              {
                "name": "value",
                "type": "u64"
              }
            ]
          },
          {
            "name": "Spl",
            "fields": [
              {
                "name": "mint",
                "type": "publicKey"
              },
              {
                "name": "value",
                "type": "u64"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LotteryConceptingError",
      "msg": "Lottery is not in concepting stage"
    },
    {
      "code": 6001,
      "name": "LotteryLiveError",
      "msg": "Lottery is not live"
    },
    {
      "code": 6002,
      "name": "LotteryDrawingError",
      "msg": "Lottery is not in drawing stage"
    },
    {
      "code": 6003,
      "name": "LotteryClaimError",
      "msg": "Lottery is not in claim stage"
    },
    {
      "code": 6004,
      "name": "LotteryNotOverError",
      "msg": "Lottery is not over yet"
    },
    {
      "code": 6005,
      "name": "LotteryNotConceptingOrLiveError",
      "msg": "Lottery is not in concepting or live stage"
    },
    {
      "code": 6006,
      "name": "MaxTicketSaleError",
      "msg": "Cannot sell ticket due to max tickets for sale being reached"
    },
    {
      "code": 6007,
      "name": "TicketNotFoundError",
      "msg": "Ticket not found or already claimed"
    },
    {
      "code": 6008,
      "name": "PrizeRemovalError",
      "msg": "Error removing prize from lottery"
    },
    {
      "code": 6009,
      "name": "WinnersClaimStatusError",
      "msg": "Not all winners have claimed their prizes"
    },
    {
      "code": 6010,
      "name": "DuplicateNFTMintError",
      "msg": "Duplicate NFT mint found in prizes vector"
    },
    {
      "code": 6011,
      "name": "UnsupportedPrizeTypeSftError",
      "msg": "SFT not yet implemented"
    },
    {
      "code": 6012,
      "name": "UnsupportedPrizeTypeSplError",
      "msg": "Spl not yet implemented"
    },
    {
      "code": 6013,
      "name": "NotPoolPrizeError",
      "msg": "not a pool prize"
    },
    {
      "code": 6014,
      "name": "NotNftPrizeError",
      "msg": "not a nft prize"
    },
    {
      "code": 6015,
      "name": "OutOfBoundsError",
      "msg": "Index out of bounds"
    },
    {
      "code": 6016,
      "name": "EmptyPrizeError",
      "msg": "Can't start a lottery without prizes"
    },
    {
      "code": 6017,
      "name": "TicketSaleBalanceError",
      "msg": "required_min_tickets_sold cannot be greater then max_tickets_for_sale"
    },
    {
      "code": 6018,
      "name": "EligibilityError",
      "msg": "We have hit the eligibility to draw winners thus we can not cancel"
    },
    {
      "code": 6019,
      "name": "ExcessiveTicketPriceError",
      "msg": "format"
    },
    {
      "code": 6020,
      "name": "AnnouncementTimingError",
      "msg": "auto_announce_winners_after cannot be less then current_time"
    },
    {
      "code": 6021,
      "name": "EndTimeTimingError",
      "msg": "end_time cannot be less then current_time"
    },
    {
      "code": 6022,
      "name": "CancelationTimingErrorAutoAnnounce",
      "msg": "Cannot cancel if we are not yet at the auto_announce_winners_after time"
    },
    {
      "code": 6023,
      "name": "CancelationTimingErrorEndTime",
      "msg": "Cannot cancel if not at the end time"
    },
    {
      "code": 6024,
      "name": "ProgramManagerSignerError",
      "msg": "Program Manager is not the signer"
    },
    {
      "code": 6025,
      "name": "ProgramManagerSameError",
      "msg": "New Program Manager is same as old Program Manager"
    },
    {
      "code": 6026,
      "name": "LotteryManagerSignerError",
      "msg": "Lottery Manager is not the signer"
    },
    {
      "code": 6027,
      "name": "LotteryManagerAllowanceError",
      "msg": "Allowance cannot be less then 0"
    },
    {
      "code": 6028,
      "name": "ImpossibleError",
      "msg": "This error should not even be possible but well done"
    },
    {
      "code": 6029,
      "name": "TicketSaleRequirementError",
      "msg": "Not enough tickets sold"
    },
    {
      "code": 6030,
      "name": "PrematureWinnersAnnouncementError",
      "msg": "Winners cannot be announced yet"
    },
    {
      "code": 6031,
      "name": "ProgramManagerAuthorityError",
      "msg": "Program manager authority is not authority of this lottery"
    },
    {
      "code": 6032,
      "name": "LotteryManagerAuthorityError",
      "msg": "Lottery manager authority is not authority of this lottery"
    },
    {
      "code": 6033,
      "name": "TODO",
      "msg": "TODO"
    }
  ]
};
