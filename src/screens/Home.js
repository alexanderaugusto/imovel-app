import React, { useState, useEffect } from 'react'
import {
  KeyboardAvoidingView,
  View,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from '@expo/vector-icons/FontAwesome5'
import { ImovelCard } from '../components'
import api from '../services/api'
import { useAuth } from '../contexts/auth'
import { useLoading } from '../contexts/loading'

import colors from '../constants/colors.json'

export default function Home() {
  const navigation = useNavigation()
  const { signed } = useAuth()
  const { startLoading, stopLoading, loading } = useLoading()

  const [properties, setProperties] = useState([])
  const [fullProperties, setFullProperties] = useState([])
  const [searchText, setSearchText] = useState('')
  const [refresh, setRefresh] = useState(false)

  const getProperties = async () => {
    await api
      .get('/properties')
      .then(res => {
        setProperties(res.data)
        setFullProperties(res.data)
      })
      .catch(err => {
        console.error(err)
      })

    stopLoading()
    setRefresh(false)
  }

  const onChangeFavorite = (item, favorite) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
      key: 'Favoritos'
    })
  }

  const onSearchChange = text => {
    setSearchText(text)
    if (!text.length) {
      setProperties(fullProperties)
    } else {
      const newItems = []
      properties.forEach(item => {
        const fullAddress = `${item.street} ${item.neighborhood} ${item.city} ${item.state} ${item.country}`
        if (
          fullAddress
            .toString()
            .toLowerCase()
            .includes(text.toString().toLowerCase())
        ) {
          newItems.push(item)
          setProperties(newItems)
        } else {
          setProperties([])
        }
      })
    }
  }

  const emptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="frown" size={120} color={colors.blue} />
        <Text style={styles.emptyList}>
          Ops, nenhuma propriedade encontrada!
        </Text>
      </View>
    )
  }

  useEffect(() => {
    setSearchText('')
    startLoading()
    getProperties()
  }, [signed])

  return (
    <KeyboardAvoidingView
      testID="home"
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text numberOfLiner={2} style={styles.headerTitle}>
          Encontre o imóvel ideal para você!
        </Text>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('../../assets/logo-black.png')}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ padding: 5 }}
          placeholder="Pesquise por localidade..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={value => onSearchChange(value)}
        />
        <TouchableOpacity style={{ alignSelf: 'center' }}>
          <Icon name="search" size={16} color={colors.blue} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={properties}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefresh(true)
            getProperties()
          }}
          refreshing={refresh}
          ListEmptyComponent={!loading ? emptyList : <></>}
          renderItem={({ item }) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('PropertyDetail', { item })}
              >
                <View>
                  <ImovelCard
                    item={item}
                    favorite={item.favorite}
                    onChangeFavorite={onChangeFavorite}
                  />
                </View>
              </TouchableWithoutFeedback>
            )
          }}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['light-primary'],
    paddingVertical: 10,
    paddingHorizontal: 30
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 35
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: colors.h1,
    alignSelf: 'center',
    opacity: 0.8,
    marginRight: 25
  },

  logo: {
    height: 75,
    width: 75
  },

  inputContainer: {
    backgroundColor: '#FFF',
    alignSelf: 'stretch',
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    },
    elevation: 2
  },

  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '25%'
  },

  emptyList: {
    marginTop: 15,
    color: '#333740',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
