import React, { FC, useCallback, useState } from "react"
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  FlatList,
  Text,
  TextStyle,
  SafeAreaView,
  TextInput,
} from "react-native"
import { TextField, Icon } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, typography } from "../theme"
import { useHeader } from "app/utils/useHeader"
import { StatusBar } from "expo-status-bar"
import { api } from "../services/api"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  inner: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: {
    fontSize: 36,
  },
  textInput: {
    marginVertical: 10,
    marginLeft: 10,
    flex: 1,
  },
  fieldContainer: {
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  sendButton: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    width: 40,
    height: 40,
  },
  chatContainer: {
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  chipRow: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 4,
  },
  chip: {
    borderRadius: 10,
    padding: 4,
  },
  chipMessage: {
    color: "black",
    fontSize: 18,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  chipAi: {
    backgroundColor: colors.palette.accent400,
  },
  chipUser: {
    backgroundColor: colors.palette.secondary300,
  },
  chipLeft: {
    justifyContent: "flex-start",
  },
  chipRight: {
    justifyContent: "flex-end",
  },
  textHour: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    textAlign: "right",
    padding: 4,
  },
  label: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    textAlign: "left",
    padding: 4,
  },
})

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const getCurrentTime = () => `${new Date().getHours()}:${new Date().getMinutes()}`
export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const [input, setInput] = useState<string>("")
  const flatListRef = React.useRef<FlatList>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState([])

  const onSendMessage = useCallback(
    async (message: string) => {
      if (message === "") return
      const newMessages = [
        ...messages,
        {
          kind: "me",
          message,
          id: Math.random(),
          time: getCurrentTime(),
        },
      ]
      setMessages(newMessages)
      flatListRef?.current?.scrollToEnd()

      setInput("")
      setIsLoading(true)
      const result = await api.sendMessage(input)
      const resultMessages = [
        ...newMessages,
        {
          kind: "ai",
          message: result.message,
          id: Math.random(),
          time: getCurrentTime(),
        },
      ]
      setIsLoading(false)
      setMessages(resultMessages)
      flatListRef?.current?.scrollToEnd()
    },
    [input, messages, isLoading, flatListRef],
  )

  useHeader({
    title: "TRAVEL BUDDY",
    backgroundColor: colors.palette.secondary500,
    titleStyle: {
      color: colors.background,
      fontWeight: "bold",
    },
    style: {
      height: 60,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        keyboardVerticalOffset={110}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const styleChip = item.kind === "ai" ? styles.chipAi : styles.chipUser
                const chipPosition = item.kind === "ai" ? styles.chipLeft : styles.chipRight
                return (
                  <View style={[styles.chipRow, chipPosition]}>
                    <View style={[styles.chip, styleChip]}>
                      {item.kind === "ai" && <Text style={styles.label}>Assistant</Text>}
                      <Text style={styles.chipMessage}>{item.message}</Text>
                      <Text style={styles.textHour}>{item.time}</Text>
                    </View>
                  </View>
                )
              }}
              style={{ flex: 1, paddingBottom: 20, paddingHorizontal: 5 }}
              refreshing={isLoading}
              
            />
            <View style={styles.inner}>
              <TextField
                placeholder="Type a message..."
                style={{ flex: 1 }}
                containerStyle={styles.textInput}
                inputWrapperStyle={styles.fieldContainer}
                onChangeText={(text) => setInput(text)}
                value={input}
              />
              <TouchableOpacity
                onPress={input.length > 1 ? () => onSendMessage(input) : () => {}}
                style={[
                  styles.sendButton,
                  { backgroundColor: input.length > 1 ? "green" : colors.palette.overlay50 },
                ]}
              >
                <Icon icon="caretRight" color="white" />
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
