import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabase = createClient(
  "https://xywtucpivpujdxwukodi.supabase.co",
  "sb_publishable_f6rz_HCH7N0gHKqJQ--duQ_9ZJxCik8",
);
