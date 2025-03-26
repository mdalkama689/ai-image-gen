import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt }: { prompt: string } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          message: "Plaese provide message!",
        },
        { status: 400 }
      );
    }

    const width = 1024;
    const height = 1024;

    const seed = uuidv4();
    const model = "flux";

    const imageUrl = await fetch(
      `https://pollinations.ai/p/${encodeURIComponent(
        prompt
      )}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=True`
    );

    return NextResponse.json(
      {
        success: true,
        message: "image generated successfully!",
        imageUrl: imageUrl.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Plaese provide message!",
      },
      { status: 400 }
    );
  }
}
