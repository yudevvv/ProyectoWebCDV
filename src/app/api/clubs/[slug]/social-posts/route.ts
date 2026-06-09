import { NextResponse } from "next/server";
import { getClubBySlug } from "@/lib/firebase/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) {
    return NextResponse.json({ error: "Club no encontrado" }, { status: 404 });
  }

  const posts: {
    id: string;
    source: "facebook" | "instagram";
    text: string;
    image?: string;
    url: string;
    createdAt: string;
  }[] = [];

  const accessToken = club.social?.facebookAccessToken;

  if (accessToken) {
    if (club.social?.facebookPageId) {
      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v19.0/${club.social.facebookPageId}/posts?fields=message,full_picture,permalink_url,created_time&access_token=${accessToken}&limit=5`,
          { signal: AbortSignal.timeout(8000) }
        );
        const fbData = await fbRes.json();
        if (fbData.data) {
          for (const post of fbData.data) {
            posts.push({
              id: `fb-${post.id}`,
              source: "facebook",
              text: post.message ?? "",
              image: post.full_picture,
              url: post.permalink_url ?? `https://facebook.com/${post.id}`,
              createdAt: post.created_time,
            });
          }
        }
      } catch {
        // Facebook fetch failed silently
      }
    }

    if (club.social?.instagramBusinessId) {
      try {
        const igRes = await fetch(
          `https://graph.facebook.com/v19.0/${club.social.instagramBusinessId}/media?fields=caption,media_url,permalink,timestamp&access_token=${accessToken}&limit=5`,
          { signal: AbortSignal.timeout(8000) }
        );
        const igData = await igRes.json();
        if (igData.data) {
          for (const post of igData.data) {
            posts.push({
              id: `ig-${post.id}`,
              source: "instagram",
              text: post.caption ?? "",
              image: post.media_url,
              url: post.permalink ?? `https://instagram.com/p/${post.id}`,
              createdAt: post.timestamp,
            });
          }
        }
      } catch {
        // Instagram fetch failed silently
      }
    }
  }

  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ posts });
}
