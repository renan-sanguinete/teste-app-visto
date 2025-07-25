import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice} from 'react-native-vision-camera';
import RoundedButton from "../components/RoundedButton";
import { useState } from 'react';
import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getDataAndLocation } from '../utils/getDataAndLocation';
import Toast from 'react-native-toast-message';

/**
 * Componente que exibe em tela a câmera.
 * O componente tambpem contém os botões com as ações, tirar foto, ativar flash e alterar a camera (front ou back).
 *
 * @component
 *
 * @returns {JSX.Element} Tela de Detalhes da foto.
 */
export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera>(null)

  const handlePhoto = async () => {
    try {
      if (cameraRef.current == null) {
        Toast.show({
          type: 'error',
          text1: 'Falha',
          text2: 'Câmera não foi encontrada',
        });
        throw new Error("Câmera não encontrada!")
      }
      const photo = await cameraRef.current.takePhoto({
        flash: flash,
      })   
      const infoPhoto = await getDataAndLocation(photo.path);
      navigation.navigate('CameraPreview', { infoPhoto });
    } catch(e) {
      console.log(e)
    }
  }
  
  if (!device) return <></>;  
  return (
    <>
        <SafeAreaView className="flex-1 bg-black">
          <View className="flex-[3]">
            <Camera
                ref={cameraRef}
                style={{flex: 1}}
                device={device}
                photo={true}
                isActive
            />
          </View>
          <View className="flex-[1]">
            <View className="flex-1 flex-row justify-between mx-10">
              <RoundedButton 
                iconName={flash === "on" ? "flash-outline" : "flash-off-outline"}
                onPress={() =>
                  setFlash((f) => (f === "off" ? "on" : "off"))
                }
                containerStyle={{alignSelf: "center"}}
              />
              <RoundedButton 
                fontIconName="dot-circle-o"
                iconSize={60}                
                onPress={() => handlePhoto()}
                containerStyle={{alignSelf: "center", backgroundColor: "transparent"}}
              />
              <RoundedButton 
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === "back" ? "front" : "back"))
                }
                containerStyle={{alignSelf: "center"}}
              />
            </View>
          </View>
        </SafeAreaView>
    </>
  );
}