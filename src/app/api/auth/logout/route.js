export async function POST(req) {
    return new Response(null, {
      status: 200,
      headers: {
        'Set-Cookie': `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      },
    });
  }
  