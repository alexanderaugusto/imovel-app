import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps'
import api from '../services/api'
import { useNavigation } from '@react-navigation/native'

import colors from '../constants/colors.json'

import InputArea from '../components/InputArea'
import ImagePickerFunction from '../components/ImagePicker'

export default function SignUp() {
  const navigation = useNavigation()

  const [data, setData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null
  })

  const onChange = (type, value) => setData({ ...data, [type]: value })

  const signUp = () => {
    const formData = new FormData()

    if (data.avatar) {
      const localUri = data.avatar.uri
      const filename = localUri.split('/').pop()

      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : `image`

      formData.append('file', { uri: localUri, name: filename, type })
    }

    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('name', data.name)
    formData.append('cpf', data.cpf)
    formData.append('phone', data.phone)

    api.post("/user", data)
      .then((res) => {
        navigation.navigate("SignIn")
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled={Platform.OS === 'ios'}
    >

      <View style={styles.header} >
        <Text style={styles.message}> Cadastre-se.</Text>
        <Text style={styles.message}> É rápido, simples e gratuito!</Text>
      </View>

      <ProgressSteps
        activeStepIconBorderColor={colors['yellow']}
        completedProgressBarColor={colors['yellow']}
        activeLabelColor={colors['yellow']}
        completedLabelColor={colors['yellow']}
        completedStepIconColor={colors['yellow']}
        completedCheckColor={colors['platinum']}
      >
        <ProgressStep
          nextBtnText={'Próximo'}
          label="Pessoal"
          nextBtnStyle={styles.button}
          nextBtnTextStyle={styles.buttonText}
          scrollable={false}
        >
          <View style={styles.containerInput}>
            <Text style={styles.label}>Nome</Text>
            <InputArea
              placeholder={'Ex: Pedro Henrique Santos'}
              value={data.name}
              onChangeText={(value) => onChange("name", value)}
            />
            <Text style={styles.label}>CPF</Text>
            <InputArea
              placeholder={'xxx.xxx.xxx-xx'}
              value={data.cpf}
              onChangeText={(value) => onChange("cpf", value)}
            />
            <Text style={styles.label}>Celular</Text>
            <InputArea
              placeholder={'(xx)xxxxx-xxxx'}
              value={data.phone}
              onChangeText={(value) => onChange("phone", value)}
            />
          </View>
        </ProgressStep>

        <ProgressStep
          label="Login"
          nextBtnText={'Próximo'}
          previousBtnText={'Anterior'}
          nextBtnStyle={styles.button}
          previousBtnStyle={styles.button}
          nextBtnTextStyle={styles.buttonText}
          previousBtnTextStyle={styles.buttonText}
          scrollable={false}
        >
          <View style={styles.containerInput}>
            <Text style={styles.messageEmail}>Por favor, entre com um e-mail válido!</Text>
            <Text style={styles.label}>E-mail</Text>
            <InputArea
              placeholder={'Ex: pedrohs@gmail.com'}
              keyboardType={'email-address'}
              value={data.email}
              onChangeText={(value) => onChange("email", value)}
            />
            <Text style={styles.label}>Confirmar e-mail</Text>
            <InputArea
              placeholder={'Ex: pedrohs@gmail.com'}
              keyboardType={'email-address'}
              value={data.confirmEmail}
              onChangeText={(value) => onChange("confirmEmail", value)}
            />
          </View>
        </ProgressStep>

        <ProgressStep
          label="Senha"
          nextBtnText={'Próximo'}
          previousBtnText={'Anterior'}
          nextBtnStyle={styles.button}
          previousBtnStyle={styles.button}
          nextBtnTextStyle={styles.buttonText}
          previousBtnTextStyle={styles.buttonText}
          scrollable={false}
        >
          <View style={styles.containerInput}>
            <Text style={styles.messageEmail}>Para sua segurança, a senha deve ter no mínimo 8 caracteres, com números, letra maiúscula e minúscula e caracteres especiais.</Text>
            <Text style={styles.label}>Senha</Text>
            <InputArea
              placeholder={'••••••••'}
              secureTextEntry={true}
              value={data.password}
              onChangeText={(value) => onChange("password", value)}
            />
            <Text style={styles.label}>Confirmar senha</Text>
            <InputArea
              placeholder={'••••••••'}
              secureTextEntry={true}
              value={data.confirmPassword}
              onChangeText={(value) => onChange("confirmPassword", value)}
            />
          </View>
        </ProgressStep>

        <ProgressStep
          label="Foto"
          previousBtnText={'Anterior'}
          finishBtnText={'Finalizar'}
          nextBtnStyle={styles.button}
          previousBtnStyle={styles.button}
          nextBtnTextStyle={styles.buttonText}
          previousBtnTextStyle={styles.buttonText}
          scrollable={false}
          onSubmit={() => signUp()}
        >
          <View style={styles.containerInput}>
            <ImagePickerFunction onPick={(image) => onChange("avatar", image)} />
          </View>
        </ProgressStep>

      </ProgressSteps>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["platinum"],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  containerInput: {
    marginBottom: 20,
  },

  header: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    width: 300,
    fontSize: 23,
    fontWeight: "600",
    color: colors['blue'],
    textAlign: 'left',
  },

  messageEmail: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "500",
    color: '#999',
    textAlign: 'center',

  },

  label: {
    marginTop: 15,
    marginBottom: -10,
    marginLeft: 20,
    fontSize: 14,
    fontWeight: "500",
    color: colors['blue'],
  },

  button: {
    height: 35,
    width: 90,
    backgroundColor: colors['yellow'],
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: colors['blue'],
    fontWeight: 'bold',
    fontSize: 16,
  },

})