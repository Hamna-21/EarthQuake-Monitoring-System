import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, updateUser } from '../repositories/userRepository';
import { getJwtSecret } from '../config/jwt';

export const getGoogleUrl = (req: Request, res: Response) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/auth/callback`;

  if (googleClientId && googleClientSecret) {
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account"
    });
    
    res.json({ 
      realMode: true,
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` 
    });
  } else {
    res.json({ 
      realMode: false,
      url: `/api/auth/google/sandbox` 
    });
  }
};

export const getGoogleSandbox = (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google Secure SSO - Developer Sandbox</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body class="bg-[#120B0A] text-white flex flex-col justify-center items-center min-h-screen px-4">
      <div class="max-w-md w-full bg-[#180F0E] border border-red-900/30 p-8 shadow-2xl shadow-red-950/40 relative">
        <div class="absolute top-0 right-0 w-16 h-16 bg-red-600/5 blur-xl"></div>
        
        <div class="flex items-center gap-2.5 mb-6 pb-4 border-b border-red-900/20">
          <svg class="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <div>
            <h1 class="text-sm font-black uppercase tracking-widest text-red-100">Google Sandbox</h1>
            <p class="text-[10px] text-red-400 font-mono tracking-wider">SECURE TELEMETRY LINKAGE</p>
          </div>
        </div>

        <p class="text-xs text-red-200/80 leading-relaxed mb-6 italic">
          Google credentials are unconfigured. Choose a developer testing account below to instantly register and authorize.
        </p>

        <div class="space-y-3.5 mb-6">
          <button onclick="selectAccount('seismic.lead@gmail.com', 'Dr. Helena Vance', 'Pakistan')" 
            class="w-full text-left p-3.5 border border-red-900/20 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center font-bold text-red-400 group-hover:scale-105 transition-transform">HV</div>
            <div>
              <p class="text-xs font-semibold text-white">Dr. Helena Vance</p>
              <p class="text-[10px] text-red-400 font-mono">seismic.lead@gmail.com</p>
            </div>
          </button>

          <button onclick="selectAccount('plate.tectonics@gmail.com', 'Kenji Tanaka', 'Pakistan')" 
            class="w-full text-left p-3.5 border border-red-900/20 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-full bg-orange-950/50 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 group-hover:scale-105 transition-transform">KT</div>
            <div>
              <p class="text-xs font-semibold text-white">Kenji Tanaka</p>
              <p class="text-[10px] text-orange-400 font-mono">plate.tectonics@gmail.com</p>
            </div>
          </button>
          
          <button onclick="selectAccount('volcanology.expert@gmail.com', 'Elena Rostova', 'Iceland')" 
            class="w-full text-left p-3.5 border border-red-900/20 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-full bg-yellow-950/50 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-400 group-hover:scale-105 transition-transform">ER</div>
            <div>
              <p class="text-xs font-semibold text-white">Elena Rostova</p>
              <p class="text-[10px] text-yellow-400 font-mono">volcanology.expert@gmail.com</p>
            </div>
          </button>
        </div>

        <div class="border-t border-red-900/20 pt-5 text-[10px] text-red-100/50 space-y-2 font-mono">
          <p class="font-bold uppercase text-red-400">💡 Custom Credentials Configuration</p>
          <p class="leading-relaxed">To connect with real Google Auth, please navigate to the <strong>Secrets panel</strong> inside AI Studio and configure:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li><code class="text-white bg-red-950 px-1 py-0.5">GOOGLE_CLIENT_ID</code></li>
            <li><code class="text-white bg-red-950 px-1 py-0.5">GOOGLE_CLIENT_SECRET</code></li>
          </ul>
        </div>
      </div>

      <script>
        function selectAccount(email, name, country) {
          if (window.opener) {
            window.opener.postMessage({
              type: "GOOGLE_AUTH_SUCCESS_MOCK",
              email: email,
              name: name,
              country: country
            }, "*");
            window.close();
          } else {
            alert("No opener window found. Try launching the flow from inside the GeoPulse interface.");
          }
        }
      </script>
    </body>
    </html>
  `);
};

export const googleSandboxCallback = async (req: Request, res: Response) => {
  const { email, name, country } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Invalid simulated OAuth payload" });
  }

  try {
    let user = await findUserByEmail(email);
    if (!user) {
      user = {
        email,
        name,
        country: country || "Pakistan",
        authProvider: "google",
        createdAt: new Date()
      };
      await createUser(user);
    } else if (user.authProvider !== "google") {
      await updateUser(email, { authProvider: "google" });
      user.authProvider = "google";
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, country: user.country },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        country: user.country,
        authProvider: user.authProvider
      }
    });
  } catch (err: any) {
    console.error("Mock SSO error:", err);
    res.status(500).json({ error: "Failed to process sandbox SSO sequence" });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.send(`
      <html>
        <body style="background-color: #120B0A; color: #f87171; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; text-align: center;">
          <div>
            <p style="font-weight: bold; font-size: 18px;">⚠️ Authorization Code Missing</p>
            <p style="font-size: 12px; color: rgba(254, 226, 226, 0.6); margin-top: 4px;">Unable to complete secure SSO sequence.</p>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl}/auth/callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Google token exchange failed:", errText);
      throw new Error("Failed to exchange auth token with Google");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user profile from Google");
    }

    const googleUser = await userResponse.json();
    const email = googleUser.email;
    const name = googleUser.name || googleUser.given_name || "Google Scholar";
    const country = "Pakistan";

    let user = await findUserByEmail(email);
    if (!user) {
      user = {
        email,
        name,
        country,
        authProvider: "google",
        createdAt: new Date()
      };
      await createUser(user);
    } else if (user.authProvider !== "google") {
      await updateUser(email, { authProvider: "google" });
      user.authProvider = "google";
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, country: user.country },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.send(`
      <html>
        <head>
          <title>Authenticating with GeoPulse...</title>
        </head>
        <body style="background-color: #120B0A; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <p style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Authentication Successful!</p>
          <p style="font-size: 11px; color: #f87171; font-family: monospace;">AUTHENTICATING WITH GEOPULSE...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: "GOOGLE_AUTH_SUCCESS_REAL", 
                token: "${token}", 
                email: "${user.email}",
                name: "${user.name}",
                country: "${user.country}"
              }, "*");
              window.close();
            } else {
              window.location.href = "/";
            }
          </script>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error("Google SSO Callback error:", error);
    res.send(`
      <html>
        <body style="background-color: #120B0A; color: #f87171; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; text-align: center;">
          <p style="font-weight: bold; font-size: 18px;">⚠️ SSO Synchronizer Error</p>
          <p style="font-size: 12px; color: rgba(254, 226, 226, 0.6); margin-top: 4px; max-w: 380px;">${error.message || "Unknown error during Google authentication."}</p>
          <p style="font-size: 10px; color: rgba(239, 68, 68, 0.7); margin-top: 16px;">Please verify that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly.</p>
        </body>
      </html>
    `);
  }
};
