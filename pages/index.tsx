import Head from 'next/head'
import styles from '../styles/index.module.scss';
import { useState, useEffect } from 'react'
import axios from 'axios';


function Home(){

  const [env, setEnv] = useState(null)
  let [loading, setLoading] = useState(false);
  const [port, setPort] = usePortStorage();


  function usePortStorage() {
    return useLocalStorage<Number>('port', -1);
  }

useEffect(() => {
  if(!env){
    fetch('/api/getEnv')
      .then((res) => res.json())
      .then((data) => {
        setEnv(data)
        if(port != -1){
          axios.get(getURL(data, port)).then((res) => {}).catch((reason) =>{
            if(reason.code == 'ERR_NETWORK'){
              setPort(-1);
            }
          })
        }
      })
  }
});

  function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState(fallbackValue);
    useEffect(() => {
      const stored = localStorage.getItem(key);
      setValue(stored ? JSON.parse(stored) : fallbackValue);
    }, [fallbackValue, key]);

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
  }



  useEffect(() =>{
  })

  function load(){
    setLoading(true);
    axios.get(`/api/node/create`).then(async (res) => {
      await new Promise(r => setTimeout(r, 20 * 1000)).then(() => {
        setPort(res.data.workbench);
        setLoading(false);
      });
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AJAN Demo</title>
        <meta name="description" content="AJAN Demo Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.info}>
        {port!=-1 && env ? `Url: ${getURL(env, port)}` : "No URL requested"}
      </div>
      <img src={"https://raw.githubusercontent.com/aantakli/AJAN-service/master/images/logo_old.bmp"} alt={'ajan-logo'}/>
      {loading? getLoadingButton() : getUrlButton(load, port!=-1)}
      <div className={styles.clickableContainer}>
        {port!=-1 && env? getEditorButton(getDemoEditorURL(env, port)) :  <></> }
        {port!=-1 && env? getWorkbenchButton(getWorkbenchURL(env, port)) :  <></> }
        {port!=-1 && env? getPacmanButton(getPacmanURL(env)) :  <></> }
      </div>

    </div>
  );
}


function getURL(env:any, port: any){
  return `${env.BASE_URL}:${port}/rdf4j/repositories/`
}

function getDemoEditorURL(env:any, port: any) {
  return `${env.BASE_URL}:${env.EDITOR_PORT}/home?name=pacman_demo&uri=${getURL(env, port)}`
}
function getWorkbenchURL(env:any, port: any) {
  return `${env.BASE_URL}:${port}/workbench`
}

function getPacmanURL(env:any) {
  return `${env.BASE_URL}:${env.PACMAN_PORT}/?uri=${env.BASE_URL}:${env.BACKEND_PORT}/api/pacman`
}

function getLoadingButton(){
  return <button disabled={true} className={styles.clickable}>Loading...</button>
}

function getUrlButton(load: any, known: boolean){
  return <button onClick={load} disabled={known} className={styles.clickable}>{known? "Requested!" : "Request new Instance"}</button>
}

function getEditorButton(url: string){
  return <a target={'_blank'} className={styles.clickable} rel={'noreferrer'} href={url}>Editor</a>
}

function getWorkbenchButton(url: string){
  return <a target={'_blank'} className={styles.clickable} rel={'noreferrer'} href={url}>Workbench</a>
}

function getPacmanButton(url: string){
  return <a target={'_blank'} className={styles.clickable} rel={'noreferrer'} href={url}>Workbench</a>
}

export default Home;
