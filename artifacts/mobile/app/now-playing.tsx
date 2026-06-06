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
import { useLibrary } from "@/context/LibraryContext";
import { useTheme } from "@/context/ThemeContext";
import { formatDuration } from "@/constants/mockData";

const { width } = Dimensions.get("window");
const DISC = width * 0.76;

export default function NowPlayingScreen() {
  const insets = useSafeAreaInsets();
  const { currentSong, isPlaying, progress, togglePlay, next, prev, isShuffled, repeatMode, toggleShuffle, cycleRepeat, addToLiked } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const { accentColor } = useTheme();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinRef = useRef<Animated.CompositeAnimation | null>(null);

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
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.empty}>No song playing</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="chevron-down" size={28} color="#fff" />
        </Pressable>
      </View>
    );
  }

  const elapsed = Math.floor(progress * currentSong.duration);

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
        <View style={[styles.vinyl, { width: DISC, height: DISC, borderRadius: DISC / 2 }]}>
          {[0.85, 0.76, 0.67].map((r, i) => (
            <View key={i} style={[styles.groove, { width: DISC * r, height: DISC * r, borderRadius: (DISC * r) / 2 }]} />
          ))}
          <Animated.View style={[styles.centerArt, { width: DISC * 0.54, height: DISC * 0.54, borderRadius: (DISC * 0.54) / 2, transform: [{ rotate: spin }] }]}>
            <Image source={{ uri: currentSong.artwork }} style={StyleSheet.absoluteFill} />
            <View style={styles.hole} />
          </Animated.View>
        </View>
      </View>

      {/* Song info */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleLike(currentSong.id); }}>
          <Feather name="heart" size={22} color={isLiked(currentSong.id) ? accentColor : "#444"} />
        </Pressable>
      </View>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` as any, backgroundColor: accentColor }]} />
          <View style={[styles.thumb, { left: `${Math.min(progress * 100, 98)}%` as any, backgroundColor: accentColor }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatDuration(elapsed)}</Text>
          <Text style={styles.timeText}>{formatDuration(currentSong.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleShuffle(); }}>
          <Feather name="shuffle" size={22} color={isShuffled ? accentColor : "#444"} />
        </Pressable>

        <Pressable style={styles.ctrlBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); prev(); }}>
          <Feather name="skip-back" size={28} color="#fff" />
        </Pressable>

        <Pressable style={styles.playBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); togglePlay(); }}>
          <Feather name={isPlaying ? "pause" : "play"} size={30} color="#000" />
        </Pressable>

        <Pressable style={styles.ctrlBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); next(); }}>
          <Feather name="skip-forward" size={28} color="#fff" />
        </Pressable>

        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); cycleRepeat(); }}>
          <Feather name="repeat" size={22} color={repeatMode !== "off" ? accentColor : "#444"} />
          {repeatMode === "one" && (
            <View style={[styles.badge, { backgroundColor: accentColor }]}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Bottom */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.bottomBtn}>
          <Feather name="list" size={20} color="#444" />
          <Text style={styles.bottomText}>Queue</Text>
        </Pressable>
        <Pressable style={styles.bottomBtn}>
          <Feather name="mic" size={20} color="#444" />
          <Text style={styles.bottomText}>Lyrics</Text>
        </Pressable>
        <Pressable style={styles.bottomBtn}>
          <Feather name="share-2" size={20} color="#444" />
          <Text style={styles.bottomText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  empty: { color: "#fff", fontSize: 18, fontFamily: "Inter_500Medium" },
  closeBtn: { marginTop: 20, padding: 10 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  topMeta: { flex: 1, alignItems: "center" },
  topSub: { fontSize: 11, color: "#555", fontFamily: "Inter_600SemiBold", letterSpacing: 1.5 },
  topAlbum: { fontSize: 13, color: "#777", fontFamily: "Inter_500Medium", marginTop: 2 },
  discWrapper: { alignItems: "center", justifyContent: "center", marginVertical: 8 },
  vinyl: {
    backgroundColor: "#111", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8, shadowRadius: 40, elevation: 20,
  },
  groove: { position: "absolute", borderWidth: 1, borderColor: "#1e1e1e" },
  centerArt: { overflow: "hidden", alignItems: "center", justifyContent: "center" },
  hole: { position: "absolute", width: 14, height: 14, borderRadius: 7, backgroundColor: "#000", borderWidth: 1, borderColor: "#333" },
  infoRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 28, marginBottom: 18, gap: 12 },
  infoText: { flex: 1 },
  songTitle: { fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
  artistName: { fontSize: 15, color: "#666", fontFamily: "Inter_400Regular", marginTop: 4 },
  progressWrap: { paddingHorizontal: 28, marginBottom: 28 },
  track: { height: 3, backgroundColor: "#1e1e1e", borderRadius: 2, marginBottom: 8 },
  fill: { height: 3, borderRadius: 2 },
  thumb: { position: "absolute", top: -5, width: 13, height: 13, borderRadius: 6.5, marginLeft: -6 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: 12, color: "#444", fontFamily: "Inter_400Regular" },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 28, marginBottom: 32 },
  ctrlBtn: { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  playBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 8, fontWeight: "700", color: "#000" },
  bottom: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 24 },
  bottomBtn: { alignItems: "center", gap: 5 },
  bottomText: { fontSize: 11, color: "#444", fontFamily: "Inter_400Regular" },
});
