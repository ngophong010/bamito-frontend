import { NextResponse } from "next/server";
import Parser from "rss-parser";

const URL = 'https://vnexpress.net/rss/the-thao.rss';

export async function GET() {
  try {
    let parser = new Parser();
    let feed = await parser.parseURL(URL);
    // console.log(feed);

    return new NextResponse(JSON.stringify(feed), {
      headers: {
        "Content-type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), {
      headers: {
        "Content-type": "application/json",
      },
      status: 400,
    });
  }
}
