import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={s.container}>
          <Text style={s.title}>Something went wrong</Text>
          <Text style={s.msg}>{this.state.error?.message}</Text>
          <Pressable style={s.btn} onPress={() => this.setState({ hasError: false, error: null })}>
            <Text style={s.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", fontFamily: "Inter_700Bold", marginBottom: 12 },
  msg: { color: "#666", fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 24 },
  btn: { backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  btnText: { color: "#000", fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
});
