import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated, Dimensions, Image, Platform,
  Pressable, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "@/context/PlayerContext";
import { useTheme } from "@/context/ThemeContext";
import { fmt } from "@/constants/data";

const { width } = Dimensions.get("window");
const DISC_SIZE = width * 0.78;

export default function NowPlayingScreen() {
  const insets = useSafeAreaInsets();
  const { currentSong, isPlaying, progress, togglePlay, next, prev, isShuffled, repeatMode, toggleShuffle, cycleRepeat, toggleLike, liked } = usePlayer();
  const { accent } = useTheme();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentAngle = useRef(0);
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      spinRef.current = Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
      );
      spinRef.current.start();
    } else {
      spinRef.current?.stop();
    }
  }, [isPlaying]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  if (!currentSong) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.noSong}>No song playing</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="chevron-down" size={28} color="#fff" />
        </Pressable>
      </View>
    );
  }

  const elapsed = Math.floor(progress * currentSong.duration);
  const remaining = currentSong.duration - elapsed;
  const isLiked = liked.has(currentSong.id);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 40 : 0) }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="chevron-down" size={26} color="#fff" />
        </Pressable>
        <View style={styles.topMeta}>
          <Text style={styles.topSub}>NOW PLAYING</Text>
          <Text style={styles.topAlbum} numberOfLines={1}>{currentSong.album}</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Feather name="more-horizontal" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Vinyl disc */}
      <View style={styles.discWrapper}>
        {/* Outer vinyl ring */}
        <View style={styles.vinylOuter}>
          {/* Grooves */}
          {[0.82, 0.74, 0.66].map((r, i) => (
            <View key={i} style={[styles.groove, { width: DISC_SIZE * r, height: DISC_SIZE * r, borderRadius: DISC_SIZE * r / 2 }]} />
          ))}
          {/* Album art in center */}
          <Animated.View style={[styles.vinylCenter, { transform: [{ rotate: spin }] }]}>
            <Image source={{ uri: currentSong.artwork }} style={styles.artImg} />
            {/* Center hole */}
            <View style={styles.hole} />
          </Animated.View>
        </View>
        {/* Tonearm */}
        <View style={[styles.tonearm, { transform: [{ rotate: isPlaying ? "25deg" : "10deg" }] }]}>
          <View style={styles.armBody} />
          <View style={styles.armHead} />
        </View>
      </View>

      {/* Song info */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <View style={styles.infoActions}>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
            <Feather name="download" size={20} color="#555" />
          </Pressable>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleLike(currentSong.id); }}>
            <Feather name="heart" size={20} color={isLiked ? accent : "#555"} />
          </Pressable>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <Pressable
          style={styles.progressTrack}
          onPress={(e) => {
            const x = e.nativeEvent.locationX;
            const pct = x / (width - 48);
            require("@/context/PlayerContext");
          }}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: accent }]} />
          <View style={[styles.thumb, { left: `${progress * 100}%` as any, backgroundColor: accent }]} />
        </Pressable>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{fmt(elapsed)}</Text>
          <Text style={styles.timeText}>{fmt(currentSong.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleShuffle(); }}>
          <Feather name="shuffle" size={22} color={isShuffled ? accent : "#555"} />
        </Pressable>

        <Pressable
          style={styles.ctrlBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); prev(); }}
        >
          <Feather name="skip-back" size={28} color="#fff" />
        </Pressable>

        <Pressable
          style={[styles.playBtn, { backgroundColor: "#fff" }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); togglePlay(); }}
        >
          <Feather name={isPlaying ? "pause" : "play"} size={30} color="#000" />
        </Pressable>

        <Pressable
          style={styles.ctrlBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); next(); }}
        >
          <Feather name="skip-forward" size={28} color="#fff" />
        </Pressable>

        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); cycleRepeat(); }}>
          <Feather
            name={repeatMode === "one" ? "repeat" : "repeat"}
            size={22}
            color={repeatMode !== "off" ? accent : "#555"}
          />
        </Pressable>
      </View>

      {/* Bottom */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.bottomBtn}>
          <Feather name="list" size={20} color="#555" />
          <Text style={styles.bottomText}>Queue</Text>
        </Pressable>
        <Pressable style={styles.bottomBtn}>
          <Feather name="mic" size={20} color="#555" />
          <Text style={styles.bottomText}>Lyrics</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  noSong: { color: "#fff", fontSize: 18, fontFamily: "Inter_500Medium" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  topMeta: { flex: 1, alignItems: "center" },
  topSub: { fontSize: 11, color: "#555", fontFamily: "Inter_600SemiBold", letterSpacing: 1.5 },
  topAlbum: { fontSize: 13, color: "#888", fontFamily: "Inter_500Medium", marginTop: 2 },
  discWrapper: { alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 16 },
  vinylOuter: {
    width: DISC_SIZE, height: DISC_SIZE, borderRadius: DISC_SIZE / 2,
    backgroundColor: "#111", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.8, shadowRadius: 40, elevation: 20,
  },
  groove: { position: "absolute", borderWidth: 1, borderColor: "#1e1e1e" },
  vinylCenter: { width: DISC_SIZE * 0.55, height: DISC_SIZE * 0.55, borderRadius: DISC_SIZE * 0.275, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  artImg: { width: "100%", height: "100%", borderRadius: DISC_SIZE * 0.275 },
  hole: { position: "absolute", width: 14, height: 14, borderRadius: 7, backgroundColor: "#000", borderWidth: 1, borderColor: "#222" },
  tonearm: {
    position: "absolute", right: -20, top: -20,
    width: 8, height: DISC_SIZE * 0.55,
    backgroundColor: "#333", borderRadius: 4,
    transformOrigin: "top right",
  },
  armBody: { flex: 1, backgroundColor: "#333", borderRadius: 4 },
  armHead: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#555", alignSelf: "center" },
  infoRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  infoText: { flex: 1 },
  songTitle: { fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
  artistName: { fontSize: 15, color: "#777", fontFamily: "Inter_400Regular", marginTop: 4 },
  infoActions: { flexDirection: "row", gap: 16, alignItems: "center" },
  progressWrap: { paddingHorizontal: 24, marginBottom: 28 },
  progressTrack: { height: 3, backgroundColor: "#222", borderRadius: 2, marginBottom: 8, position: "relative" },
  progressFill: { height: 3, borderRadius: 2 },
  thumb: { position: "absolute", top: -5, width: 13, height: 13, borderRadius: 6.5, marginLeft: -6 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: 12, color: "#555", fontFamily: "Inter_400Regular" },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 32 },
  ctrlBtn: { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  playBtn: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center" },
  closeBtn: { marginTop: 20, padding: 10 },
  bottom: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 40 },
  bottomBtn: { alignItems: "center", gap: 4 },
  bottomText: { fontSize: 11, color: "#555", fontFamily: "Inter_400Regular" },
});
