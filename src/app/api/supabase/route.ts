import { NextResponse } from "next/server";
import supabase from "@/utils/supabase";

export async function GET() {
    // docs: https://supabase.com/docs/reference/javascript/typescript-support
  const {data} = await supabase.from("media").select('id, title').eq('id', 2)
  return NextResponse.json(
    data,
    {
      status: 200,
    }
  );
}
