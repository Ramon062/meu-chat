
import React, { useState } from 'react';
import ChatInicial from './TelaInicial/ChatInicial';
import HomeInicial from './TelaHome/index';
import Rotas from './rotas';




export default function App() {
  const [user, setUser] = useState();
  return <Rotas/>;
}