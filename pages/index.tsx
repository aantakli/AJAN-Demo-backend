import Head from 'next/head'
import styles from '../styles/index.module.scss';
import { useState, useEffect } from 'react'
import axios from 'axios';


function Home(){

  let [loading, setLoading] = useState(false);
  const [port, setPort] = usePortStorage();


  function usePortStorage() {
    return useLocalStorage<Number>('port', -1);
  }

useEffect(() => {
  if(port != -1){
    axios.get(getURL(port)).then((res) => {}).catch((reason) =>{
      if(reason.code == 'ERR_NETWORK'){
        setPort(-1);
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
        {port!=-1 ? `Url: ${getURL(port)}` : "No URL requested"}<br/>
      </div>
      <img src={"https://raw.githubusercontent.com/aantakli/AJAN-service/master/images/logo_old.bmp"} alt={'ajan-logo'}/>
      {loading? getLoadingButton() : getUrlButton(load, port!=-1)}
      {port!=-1? getEditorButton(getDemoURL(port)) :  <></> }

    </div>
  );
}


function getURL(port: any){
  return `${process.env.NEXT_PUBLIC_HOST}:${port}/rdf4j/repositories/`
}

function getDemoURL(port: any) {
  return `${process.env.NEXT_PUBLIC_EDITOR_HOST}/home?name=demo&uri=${getURL(port)}`
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

export default Home;
