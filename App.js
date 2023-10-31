import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { DATA } from './data'
import { Gesture, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS, withSpring } from 'react-native-reanimated';
import Item from './item'

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.85;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.3;
const SPACING = IMAGE_WIDTH * 0.1;

export default function App() {

  const animatedValue = useSharedValue(0);
  const [_index, setIndex] = useState(0);
  const [data, setData] = useState(DATA);

  const setCurrentIndex = (V) => {
    if (V == 'Up') {
      setIndex(_index + 1);
      animatedValue.value = withSpring(_index + 1);
    } else if (V == 'Down') {
      setIndex(_index - 1);
      animatedValue.value = withSpring(_index - 1);
    }
  }

  const handleUp = Gesture
    .Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (_index == data.length - 1) {
        return;
      }
      runOnJS(setCurrentIndex)('Up')
    })

  const handleDown = Gesture
    .Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (_index == 0) {
        return;
      }
      runOnJS(setCurrentIndex)('Down')
    })

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <FlatList
          // o zIndex do "CellRenderer..." só funciona com "removeClipped"... como "false"
          // removeClippedSubviews é uma propriedade que pode ser usada com o componente FlatList no React Native. Ela controla se os itens fora da área visível da lista devem ser "removidos" da renderização para melhorar o desempenho. Quando removeClippedSubviews está habilitado, os itens que estão fora da área visível da lista são desmontados (unmounted) para economizar recursos de renderização.
          // está na documentação: "Contras: Esteja ciente de que essa implementação pode ter bugs, como falta de conteúdo (principalmente observado no iOS), especialmente se você estiver fazendo coisas complexas com transformações e/ou posicionamento absoluto. Observe também que isso não economiza memória significativa porque as exibições não são desalocadas, apenas desanexadas."
          removeClippedSubviews={false}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          CellRendererComponent={({ index, children, style, ...props }) => {
            const newStyle = [
              style,
              {
                zIndex: data.length - index,
                top: -IMAGE_HEIGHT / 2,
                left: -IMAGE_WIDTH / 2,
              },
            ];
            return (
              <View index={index} {...props} style={newStyle}>
                {children}
              </View>
            )
          }}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {

            return (
              <Item _index={_index} index={index} {...item} animatedValue={animatedValue} handleUp={handleUp} handleDown={handleDown} />
            )
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});