import Head from 'next/head'
import styles from '../styles/index.module.scss';
import { useState, useEffect } from 'react'
import axios from 'axios';


function Home(){

  const [env, setEnv] = useState(null)
  const [log, setLog] = useState<JSX.Element[]>()
  let [loading, setLoading] = useState(true);
  const [storagePort, setStoragePort] = useStoragePort();
  const [workbenchPort, setWorkbenchPort] = useWorkbenchPort();
  const [containerID, setContainerID] = useContainerID();


  function useWorkbenchPort() {
    return useLocalStorage<Number>('workbenchPort', -1);
  }
  function useStoragePort() {
    return useLocalStorage<Number>('storagePort', -1);
  }

  function useContainerID() {
    return useLocalStorage<String>('containerID', "");
  }

useEffect(() => {
  if(!env){
    fetch('/api/getEnv')
      .then((res) => res.json())
      .then((data) => {
        setEnv(data)
        if(workbenchPort != -1){
          axios.get(getURL(data, workbenchPort)).then((res) => {}).catch((reason) =>{
            if(reason.code == 'ERR_NETWORK'){
              setWorkbenchPort(-1);
              setStoragePort(-1);
              setContainerID("");
            }
            setLoading(false);
          })
        } else {
          setLoading(false);
        }
      })
  }
}, [env, workbenchPort, setWorkbenchPort, setStoragePort, setContainerID]);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("containerID: ", containerID)
      if(containerID != ""){
        fetchLogUpdate()
      }
    }, 3200);
    return () => clearInterval(id);
  })

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


  function findFirstDiffPos(a: string, b: string) {
    var i = 0;
    if (a === b) return -1;
    while (a[i] === b[i]) i++;
    return i;
  }

  function findRestofString(a: string , b: string ){
    let i = findFirstDiffPos(a, b);
    if(i == -1){
      return "";
    }
    if(a > b){
      return a.substring(i)
    }
    return b.substring(i)
  }

  function fetchLogUpdate(){
    axios.get(`/api/node/logUpdate?id=${containerID}`).then(async (res) => {
      let log = res.data.replaceAll(/^[\W_]+/gm, "")
      let data: JSX.Element[] = [];
      log.split('\n').forEach((line: string) => {
        let start = line.split(' ')[0].split("-")[0];
        if(start.length != 4){
          line = line.replace(start[0], '');
        }
        let date = line.split(" ")[0];
        line = line.replace(date, "");
        let e = <span></span>
        if(date){
          let format = new Date(date).toTimeString().split(" ")[0] + ':'
          e = <div><span>{format}</span> <span>{line}</span></div>;
        }
        data.push(e)
      })
      setLog(data.reverse());
    })
  }

  function load(){
    setLoading(true);
    axios.get(`/api/node/create`).then(async (res) => {
      await new Promise(r => setTimeout(r, 2 * 1000)).then(() => {
        setWorkbenchPort(res.data.workbench);
        setStoragePort(res.data.storage);
        setContainerID(res.data.containerID);
        setLoading(false);
      });
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Head>
          <title>AJAN Demo</title>
          <meta name="description" content="AJAN Demo Website"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <div className={styles.info}>
          {workbenchPort != -1 && env ? `Url: ${getURL(env, workbenchPort)}` : "No URL requested"}
        </div>
        <img src={"/AJAN-Logo-TW.png"} alt={'ajan-logo'}/>
        {loading ? getLoadingButton() : getUrlButton(load, workbenchPort != -1)}
        <div className={styles.clickableContainer}>
          {workbenchPort != -1 && env ? getEditorButton(getDemoEditorURL(env, workbenchPort)) : <></>}
          {workbenchPort != -1 && env ? getWorkbenchButton(getWorkbenchURL(env, workbenchPort)) : <></>}
          {workbenchPort != -1 && env ? getPacmanButton(getPacmanURL(env, workbenchPort, storagePort)) : <></>}
        </div>
        {(!loading && workbenchPort != -1 && log) && <div className={styles.log}>{log}</div>}
      </div>
    </div>
  );
}


function getURL(env: any, port: any){
  return `${env.BASE_URL}:${port}/rdf4j/repositories/`
}

function getDemoEditorURL(env:any, port: any) {
  return `${env.BASE_URL}:${env.EDITOR_PORT}/home?name=pacman_demo&uri=${getURL(env, port)}`
}
function getWorkbenchURL(env:any, port: any) {
  return `${env.BASE_URL}:${port}/workbench`
}

function getPacmanURL(env:any, workbench_port:any, storage_port:any) {
  return `${env.BASE_URL}:${env.PACMAN_PORT}/?uri=${env.BASE_URL}:${env.BACKEND_PORT}/api/pacman&workbench_port=${workbench_port}&storage_port=${storage_port}`
}


function getLoadingButton() {
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
  return <a target={'_blank'} className={styles.clickable} rel={'noreferrer'} href={url}>Pacman</a>
}

export default Home;
