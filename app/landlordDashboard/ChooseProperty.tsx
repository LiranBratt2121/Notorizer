import { SafeAreaView, FlatList, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
import PropertyCard from '@/components/common/PropertyCard'

const ChooseProperty = () => {
  const data = [
    <PropertyCard property={'Karen'} imageUrl={'XXXX'} onPress={() => {}}/>,
    <PropertyCard property={'JOE'} imageUrl={'XXXX'} onPress={() => {}}/>,
    <PropertyCard property={'LIBBY'} imageUrl={'XXXX'} onPress={() => {}}/>
  ]    

  return (
    <SafeAreaView>
      <FlatList
      data={data}
      renderItem={({ item }) => item}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
})
export default ChooseProperty