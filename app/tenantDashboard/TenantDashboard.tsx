import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Button from '@/components/common/Button'

const TenantDashboard = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>TenantDashboard</Text>
      <Button 
        title='Report Problem'
        onPress={() => router.push({pathname:'/tenantDashboard/ReportProblem' as any})}
      />

      <Button 
        title='Update Spaces'
        onPress={() => router.push({pathname:'/tenantDashboard/UpdateSpaces' as any})}
      />
    </SafeAreaView>
  )
}

export default TenantDashboard