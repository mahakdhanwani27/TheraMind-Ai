// app/lib/activity.ts (Frontend API utilities)

interface ActivityEntry {
    type: string;
    name: string;
    description?: string;
    duration?: number;
  }
  
  /**
   * Logs a user activity
   */
  export async function logActivity(
    data: ActivityEntry
  ): Promise<{ success: boolean; data: any }> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
  
    const response = await fetch("/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to log activity");
    }
  
    return response.json();
  }
  
  /**
   * Fetches all activities for a given user
   */
  export async function getUserActivities(userId?: string) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
  
    // Include userId in query params if provided
    const url = userId ? `/api/activity?userId=${userId}` : `/api/activity`;
  
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch activities");
    }
  
    return response.json();
  }
  
  /**
   * Saves a user's mood (with optional userId and note)
   */
  export async function saveMoodData({
    userId,
    mood,
    note = "",
  }: {
    userId?: string;
    mood: string | number;
    note?: string;
  }) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
  
    const response = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, mood, note }),
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to save mood data");
    }
  
    return response.json();
  }
  
  
  