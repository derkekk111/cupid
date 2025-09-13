// src/components/MatchMaker.jsx
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;   // set in env
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <div style={{
      border: "1px solid #ddd", borderRadius: 8, padding: 12, width: 260,
      display: "flex", flexDirection: "column", gap: 8, alignItems: "center"
    }}>
      <img src={profile.avatar_url || "https://placehold.co/120x120"} alt={profile.name}
           style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
      <div style={{ fontWeight: 700 }}>{profile.name || "No name"}</div>
      {profile.age && <div>Age: {profile.age}</div>}
      {profile.bio && <div style={{ fontSize: 13, textAlign: "center" }}>{profile.bio}</div>}
      <div style={{ fontSize: 12, color: "#666" }}>{profile.location}</div>
    </div>
  );
}

export default function MatchMaker() {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([null, null]);
  const [message, setMessage] = useState("");

  // fetch two random profiles via RPC
  async function fetchTwoRandom() {
    setLoading(true);
    setMessage("");
    try {
      // RPC call - returns up to 2 rows
      const { data, error } = await supabase.rpc("get_two_random_profiles");
      if (error) throw error;
      if (!data || data.length < 2) {
        setMessage("Not enough users to match (need at least 2).");
        setProfiles([data?.[0] ?? null, null]);
      } else {
        setProfiles([data[0], data[1]]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch profiles.");
    } finally {
      setLoading(false);
    }
  }

  // create a match row
  async function createMatch() {
    setLoading(true);
    setMessage("");
    try {
      const [p1, p2] = profiles;
      if (!p1 || !p2) {
        setMessage("Missing two profiles to match.");
        setLoading(false);
        return;
      }

      // normalize order to avoid unique constraint collisions
      const user1_id = p1.id < p2.id ? p1.id : p2.id;
      const user2_id = p1.id < p2.id ? p2.id : p1.id;

      const { data, error } = await supabase
        .from("matches")
        .insert([{ user1_id, user2_id }])
        .select()
        .single();

      if (error) {
        // if unique constraint, show friendly message
        console.error("insert error:", error);
        if (error.code === "23505" || (error.details && error.details.includes("duplicate"))) {
          setMessage("Those two are already matched.");
        } else {
          setMessage("Failed to create match.");
        }
      } else {
        setMessage(`Matched ${p1.name} and ${p2.name} successfully!`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error creating match.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial fetch
    fetchTwoRandom();
    // optionally, you could subscribe to profile changes using supabase.channel if you want live updates
  }, []);

  return (
    <div style={{ maxWidth: 820, margin: "24px auto", textAlign: "center" }}>
      <h2>Cupid — Quick Match</h2>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 12 }}>
        <ProfileCard profile={profiles[0]} />
        <div style={{ alignSelf: "center" }}>
          <button onClick={createMatch} disabled={loading || !profiles[0] || !profiles[1]}
                  style={{ padding: "10px 18px", marginBottom: 8 }}>
            {loading ? "Working…" : "Match These Two"}
          </button>
          <br />
          <button onClick={fetchTwoRandom} disabled={loading} style={{ padding: "8px 14px" }}>
            {loading ? "…" : "Shuffle"}
          </button>
        </div>
        <ProfileCard profile={profiles[1]} />
      </div>

      <div style={{ color: "#444", minHeight: 24 }}>{message}</div>
    </div>
  );
}