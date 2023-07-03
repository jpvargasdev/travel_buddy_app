import React, { FC, useCallback, useState } from "react"
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native"
import { TextField, Icon } from "../components"
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors } from "../theme"
import { useHeader } from "app/utils/useHeader"
import { StatusBar } from "expo-status-bar"
import { api } from "../services/api"
import { SafeAreaView } from "react-native-safe-area-context"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  inner: {
    flexDirection: "row",
  },
  header: {
    fontSize: 36,
  },
  textInput: {
    margin: 10,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  sendButton: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  chatContainer: {
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  chatField: {
    marginVertical: 10,
    marginLeft: 10,
    flex: 1,
  },
})

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({}) => {
  const [input, setInput] = useState<string>("")

  const onSendMessage = useCallback(async () => {
    const result = await api.sendMessage(input)
    console.log(result)
  }, [])

  useHeader({
    title: "TRAVEL BUDDY",
    backgroundColor: colors.palette.secondary500,
    titleStyle: {
      color: colors.background,
      fontWeight: "700",
    },
    style: {
      height: 48,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        keyboardVerticalOffset={90}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TextField
              placeholder="Write here!"
              style={styles.textInput}
              containerStyle={styles.chatField}
            />
            <TouchableOpacity
              onPress={onSendMessage}
              style={[
                styles.sendButton,
                { backgroundColor: input.length ? "green" : colors.palette.overlay50 },
              ]}
            >
              <Icon icon="caretRight" color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
