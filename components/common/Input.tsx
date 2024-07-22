import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label: string;
};

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor="#888"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});

export default Input;
