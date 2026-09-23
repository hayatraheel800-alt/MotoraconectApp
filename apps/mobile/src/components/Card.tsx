import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
export function Card({ style, ...rest }: ViewProps) { const theme=useTheme(); return <View style={[{backgroundColor:theme.colors.background,borderRadius:theme.radius.lg,borderWidth:1,borderColor:theme.colors.border,padding:theme.spacing.md},style]} {...rest}/>; }