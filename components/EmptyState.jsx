import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '../constants'

import CustomButton from "./CustomButton"
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }) => {
    return (
        <View className="justify-center items-center px-4">
            <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode='contain' />
            
            <Text className="text-2xl text-center font-psemibold text-white mt-2">
                {title}
            </Text>
            <Text className="font-pmedium text-sm text-gray-100">
                {subtitle}
            </Text>
            <View className="mt-5">
            <CustomButton 
            title="Create video"
            handlePress={() => router.push("/create")}
            containerStyles="w-full my-5"
            textStyles={"text-lg pl-5 pr-5"}
            />
            </View>    
        </View>
    )
}

export default EmptyState;