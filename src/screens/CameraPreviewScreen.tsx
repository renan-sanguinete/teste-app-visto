import React from 'react';
import { View, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import { StackParamList } from "../types/StackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { savePhoto } from "../utils/useCameraStorage";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteCachedPhoto } from "../utils/deleteCachedPhoto";
import Toast from 'react-native-toast-message';
type Props = NativeStackScreenProps<StackParamList, 'CameraPreview'>;

const CameraPreviewScreen = ({ route, navigation }: Props) => {
  const { infoPhoto } = route.params;

  const handleSave = async () => {
    const savedPath = await savePhoto(infoPhoto);
    if (savedPath) {
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Foto salva',
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Gallery' }],
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível salvar a foto',
      });
    }
  };

  const handleDeleteCachedPhoto = async () => {
    const photoPath = 'file://' + infoPhoto.uri;
    await deleteCachedPhoto(photoPath);
    navigation.goBack();
  };

/**
 * Componente que exibe detalhes da foto.
 *
 * Exibe a foto tirada e também informações como data, hora e localização de quando a foto foi tirada.
 * Possui os botões:
 * Apagar Foto: Que apaga a foto do cache e os dados da foto.
 * Salvar Foto: Que salva a foto no dispositivo e os dados em um json.
 *
 * @component
 * @param {NativeStackScreenProps<StackParamList, 'CameraPreview'>} props - Propriedades do NativeStackScreenProps, incluindo route, navigation.
 *
 * @returns {JSX.Element} Tela de Detalhes da foto.
 */
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="flex-[3] items-center justify-center bg-black">
        <Image
          source={{ uri: 'file://' + infoPhoto.uri }}
          style={{ flex: 1, aspectRatio: 1 }}
          resizeMode="contain"
        />
      </View>
      <SafeAreaView className="flex-[1] w-full bg-slate-300" edges={['bottom']}>
        <View className="flex-[1] mx-6 my-2 p-3 bg-white rounded-lg">
          <Text className="text-sm font-semibold text-gray-500">
            Informações
          </Text>
          <View className="h-[1] bg-slate-300 my-2"/>
          <Text className="text-xs font-medium  text-gray-500">
            {`Data / Hora: ${infoPhoto.data} - ${infoPhoto.hora}`}
          </Text>
          {infoPhoto.latitude && infoPhoto.longitude && (
            <Text className="text-xs font-normal text-gray-500">
              {`Latitude / Longitude: ${infoPhoto.latitude.toFixed(5)} ${infoPhoto.longitude?.toFixed(5)}`}
            </Text>
            )}
        </View>
        <View className="flex-[1] mx-6 flex-row items-center justify-between bg-slate-300">
          <TouchableOpacity
            className="bg-red-500 flex-row items-center px-4 py-2 my-4 rounded"
            onPress={() => handleDeleteCachedPhoto()}
          > 
            <MaterialIcons name="delete" size={16} color="white" />
            <Text className="text-white ml-1 text-center">Apagar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 flex-row items-center px-4 py-2 my-4 rounded"
            onPress={() => handleSave()}
          >
            <MaterialIcons name="save" size={16} color="white" />
            <Text className="text-white ml-1 text-center">Salvar Foto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CameraPreviewScreen;
