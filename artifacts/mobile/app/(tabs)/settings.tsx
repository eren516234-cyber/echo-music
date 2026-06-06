import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView,
  StyleSheet, Switch, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ACCENT_COLORS, useTheme } from "@/context/ThemeContext";

function Row({ label, sub, right }: { label: string; sub?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right}
    </View>
  );
}

function NavRow({ label, sub }: { label: string; sub?: string }) {
  return (
    <Pressable style={styles.row} onPress={() => {}}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Feather name="chevron-right" size={16} color="#333" />
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { accentColor, rainbowMode, perScreenColor, setAccentColor, toggleRainbowMode, togglePerScreenColor, resetToBlackWhite } = useTheme();

  const [crossfade, setCrossfade] = useState(true);
  const [normalize, setNormalize] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [translation, setTranslation] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 27 : 0) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 20 }}
      >
        <Text style={styles.heading}>Settings</Text>

        {/* THEME */}
        <SectionLabel>THEME</SectionLabel>
        <View style={styles.card}>
          <Row
            label="🌈 Rainbow Mode"
            sub="Change the app colour"
            right={
              <Switch
                value={rainbowMode}
                onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleRainbowMode(); }}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={rainbowMode ? "#000" : "#555"}
              />
            }
          />
          <View style={styles.divider} />

          <View style={styles.colorSection}>
            <Text style={styles.rowLabel}>🎨 Custom Colour</Text>
            <View style={styles.colorRow}>
              {ACCENT_COLORS.map(c => (
                <Pressable
                  key={c.value}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c.value },
                    accentColor === c.value && styles.colorDotActive,
                  ]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setAccentColor(c.value); }}
                />
              ))}
            </View>
          </View>
          <View style={styles.divider} />

          <Row
            label="🖼 Per-Screen Colour"
            sub="Each screen has its own colour"
            right={
              <Switch
                value={perScreenColor}
                onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); togglePerScreenColor(); }}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={perScreenColor ? "#000" : "#555"}
              />
            }
          />
          <View style={styles.divider} />

          <Pressable
            style={styles.resetBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); resetToBlackWhite(); }}
          >
            <Text style={styles.resetText}>Reset to Black & White</Text>
          </Pressable>
        </View>

        {/* PLAYBACK */}
        <SectionLabel>PLAYBACK</SectionLabel>
        <View style={styles.card}>
          <NavRow label="Audio Quality"   sub="High · 320kbps" />
          <View style={styles.divider} />
          <NavRow label="Equalizer"       sub="Custom bands" />
          <View style={styles.divider} />
          <Row
            label="Crossfade"
            sub="3 seconds"
            right={
              <Switch value={crossfade} onValueChange={setCrossfade}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={crossfade ? "#000" : "#555"} />
            }
          />
          <View style={styles.divider} />
          <Row
            label="Normalize Volume"
            right={
              <Switch value={normalize} onValueChange={setNormalize}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={normalize ? "#000" : "#555"} />
            }
          />
        </View>

        {/* CONTENT */}
        <SectionLabel>CONTENT</SectionLabel>
        <View style={styles.card}>
          <NavRow label="Spotify Import"  sub="Transfer playlists" />
          <View style={styles.divider} />
          <NavRow label="Import / Export" sub="Backups" />
          <View style={styles.divider} />
          <NavRow label="Country"         sub="India" />
          <View style={styles.divider} />
          <NavRow label="Listen Together" sub="Sync playback with friends" />
        </View>

        {/* AI */}
        <SectionLabel>AI</SectionLabel>
        <View style={styles.card}>
          <Row
            label="AI Suggestions"
            sub="Personalised recommendations"
            right={
              <Switch value={aiSuggestions} onValueChange={setAiSuggestions}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={aiSuggestions ? "#000" : "#555"} />
            }
          />
          <View style={styles.divider} />
          <Row
            label="Translation"
            sub="Lyrics & UI"
            right={
              <Switch value={translation} onValueChange={setTranslation}
                trackColor={{ false: "#222", true: "#fff" }}
                thumbColor={translation ? "#000" : "#555"} />
            }
          />
        </View>

        {/* STORAGE */}
        <SectionLabel>STORAGE</SectionLabel>
        <View style={styles.card}>
          <NavRow label="Downloaded Songs" sub="2 songs · 14 MB" />
          <View style={styles.divider} />
          <NavRow label="Clear Cache"      sub="38 MB" />
        </View>

        {/* ABOUT */}
        <SectionLabel>ABOUT</SectionLabel>
        <View style={styles.card}>
          <Row label="Version" sub="YVL Music 1.0.0" />
          <View style={styles.divider} />
          <NavRow label="GitHub"           sub="eren516234-cyber/echo-music" />
          <View style={styles.divider} />
          <NavRow label="Check for Updates" />
          <View style={styles.divider} />
          <NavRow label="Privacy Policy" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  heading: { fontSize: 28, fontWeight: "800", color: "#fff", fontFamily: "Inter_700Bold", marginTop: 8, marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: "600", color: "#555", fontFamily: "Inter_600SemiBold", letterSpacing: 1.2, marginBottom: 10, marginTop: 20 },
  card: { backgroundColor: "#111", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#1e1e1e" },
  divider: { height: 1, backgroundColor: "#1a1a1a" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15, color: "#fff", fontFamily: "Inter_500Medium" },
  rowSub: { fontSize: 12, color: "#555", fontFamily: "Inter_400Regular", marginTop: 2 },
  colorSection: { paddingHorizontal: 16, paddingVertical: 14 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  colorDot: { width: 34, height: 34, borderRadius: 17 },
  colorDotActive: { borderWidth: 3, borderColor: "#fff", transform: [{ scale: 1.15 }] },
  resetBtn: { paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" },
  resetText: { fontSize: 14, color: "#555", fontFamily: "Inter_500Medium" },
});
