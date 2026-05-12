import { NextResponse } from "next/server";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { CONTRACT_ADDRESS, VYRON_ABI } from "@/lib/contracts";

export async function GET() {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) {
      throw new Error("RPC URL not configured");
    }

    const provider = new JsonRpcProvider(rpcUrl);
    
    // We only try to read contract stats if an address is provided
    // and it's not the default zero address
    if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
      const contract = new Contract(CONTRACT_ADDRESS, VYRON_ABI, provider);
      
      const [totalSupply, isPaused, owner] = await Promise.all([
        contract.totalSupply(),
        contract.paused().catch(() => false),
        contract.owner().catch(() => "Unknown")
      ]);

      return NextResponse.json({
        success: true,
        data: {
          totalSupply: formatUnits(totalSupply, 18),
          isPaused,
          owner,
          contractAddress: CONTRACT_ADDRESS,
          network: "BNB Smart Chain Testnet"
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: {
          totalSupply: "1000000",
          isPaused: false,
          owner: "Not Deployed",
          contractAddress: "Not Deployed",
          network: "BNB Smart Chain Testnet"
        }
      });
    }
  } catch (error: unknown) {
    console.error("Error fetching stats:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
