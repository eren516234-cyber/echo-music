import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated, Dimensions, Image, PanResponder,
  Platform, Pressable, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "@/context/PlayerContext";
import { GLOBAL_SONGS, GlobalSong } from "@/constants/data";

const { width, height } = Dimensions.get("window");
const GLOBE_SIZE = Math.min(width, height * 0.55);
const R = GLOBE_SIZE / 2;

function project3D(x: number, y: number, rotX: number, rotY: number) {
  const phi = (y - 0.5) * Math.PI;
  const theta = (x - 0.5) * 2 * Math.PI + rotY;
  const px = Math.cos(phi) * Math.sin(theta);
  const py = -Math.sin(phi) * Math.cos(rotX) + Math.cos(phi) * Math.cos(theta) * Math.sin(rotX);
  const pz = Math.sin(phi) * Math.sin(rotX) + Math.cos(phi) * Math.cos(theta) * Math.cos(rotX);
  return { px, py, pz };
}

export default function GlobeScreen() {
  const insets = useSafeAreaInsets();
  const { playSong, currentSong } = usePlayer();
  const [selected, setSelected] = useState<GlobalSong | null>(null);
  const rotX = useRef(0.3);
  const rotY = useRef(0);
  const rotAnim = useRef(new Animated.ValueXY({ x: 0.3, y: 0 })).current;
  const lastPos = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        lastPos.current = { x: gs.x0, y: gs.y0 };
      },
      onPanResponderMove: (_, gs) => {
        const dx = (gs.moveX - lastPos.current.x) / GLOBE_SIZE * 3;
        const dy = (gs.moveY - lastPos.current.y) / GLOBE_SIZE * 3;
        lastPos.current = { x: gs.moveX, y: gs.moveY };
        rotY.current += dx;
        rotX.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX.current + dy));
        rotAnim.setValue({ x: rotX.current, y: rotY.current });
      },
    })
  ).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 27 : 0) }]}>
      <Text style={styles.title}>Music Globe</Text>
      <Text style={styles.sub}>{GLOBAL_SONGS.length} songs from around the world · drag to spin</Text>

      <View style={styles.globeWrap} {...panResponder.panHandlers}>
        {/* Globe circle */}
        <View style={styles.globe}>
          {/* Latitude lines */}
          {[-40, 0, 40].map(lat => (
            <View
              key={lat}
              style={[styles.latLine, {
                top: R + (lat / 90) * R - 0.5,
                width: Math.cos((lat * Math.PI) / 180) * GLOBE_SIZE,
                left: R - Math.cos((lat * Math.PI) / 180) * R,
              }]}
            />
          ))}
          {/* Longitude lines */}
          {[0, 60, 120].map(lon => (
            <View key={lon} style={[styles.lonLine, { left: R - 0.5, transform: [{ rotate: `${lon}deg` }] }]} />
          ))}

          <Animated.View style={{ position: "absolute", width: GLOBE_SIZE, height: GLOBE_SIZE }}>
            {GLOBAL_SONGS.map(song => {
              const { px, py, pz } = project3D(song.x, song.y, rotX.current, rotY.current);
              const screenX = R + px * R * 0.9;
              const screenY = R + py * R * 0.9;
              const visible = pz > 0;
              const scale = 0.6 + pz * 0.5;
              const opacity = visible ? 0.4 + pz * 0.6 : 0;
              const isActive = currentSong?.id === song.id || selected?.id === song.id;

              return (
                <Pressable
                  key={song.id}
                  style={[styles.dot, {
                    left: screenX - 18,
                    top: screenY - 18,
                    opacity,
                    transform: [{ scale }],
                    borderColor: isActive ? "#fff" : song.color,
                    backgroundColor: song.color + "33",
                  }]}
                  onPress={() => {
                    if (!visible) return;
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    if (selected?.id === song.id) {
                      playSong(song as any, GLOBAL_SONGS as any);
                      setSelected(null);
                    } else {
                      setSelected(song);
                    }
                  }}
                >
                  <Image source={{ uri: song.artwork }} style={styles.dotImg} />
                </Pressable>
              );
            })}
          </Animated.View>
        </View>
      </View>

      {/* Selected card */}
      {selected && (
        <View style={[styles.card, { borderColor: selected.color + "66" }]}>
          <Image source={{ uri: selected.artwork }} style={styles.cardImg} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{selected.title}</Text>
            <Text style={styles.cardArtist}>{selected.artist}</Text>
            <View style={styles.cardMeta}>
              <Feather name="map-pin" size={11} color="#666" />
              <Text style={styles.cardCountry}>{selected.country}</Text>
            </View>
          </View>
          <Pressable
            style={[styles.playBtn, { backgroundColor: selected.color }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              playSong(selected as any, GLOBAL_SONGS as any);
              setSelected(null);
            }}
          >
            <Feather name="play" size={18} color="#000" />
          </Pressable>
        </View>
      )}

      {!selected && (
        <Text style={styles.hint}>tap cover → tap again to play</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", color: "#fff", fontFamily: "Inter_700Bold", marginTop: 8 },
  sub: { fontSize: 13, color: "#555", fontFamily: "Inter_400Regular", marginTop: 4, marginBottom: 20 },
  globeWrap: { width: GLOBE_SIZE + 20, height: GLOBE_SIZE + 20, alignItems: "center", justifyContent: "center" },
  globe: {
    width: GLOBE_SIZE, height: GLOBE_SIZE, borderRadius: GLOBE_SIZE / 2,
    backgroundColor: "#080818",
    borderWidth: 1, borderColor: "#1e2040",
    overflow: "hidden",
    shadowColor: "#3040ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  latLine: { position: "absolute", height: 1, backgroundColor: "#ffffff0a" },
  lonLine: { position: "absolute", width: 1, height: GLOBE_SIZE, backgroundColor: "#ffffff0a" },
  dot: {
    position: "absolute", width: 36, height: 36, borderRadius: 8,
    borderWidth: 1.5, overflow: "hidden", alignItems: "center", justifyContent: "center",
  },
  dotImg: { width: 36, height: 36, borderRadius: 6 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#111", borderRadius: 14, padding: 12,
    marginHorizontal: 20, borderWidth: 1, width: width - 40,
  },
  cardImg: { width: 52, height: 52, borderRadius: 8, backgroundColor: "#1a1a1a" },
  cardInfo: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#fff", fontFamily: "Inter_600SemiBold" },
  cardArtist: { fontSize: 12, color: "#777", fontFamily: "Inter_400Regular" },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  cardCountry: { fontSize: 11, color: "#555", fontFamily: "Inter_400Regular" },
  playBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  hint: { fontSize: 13, color: "#333", fontFamily: "Inter_400Regular", marginTop: 16 },
});
