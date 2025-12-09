/* DATA URLs */
const URL_PLATOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=0&single=true&output=csv";
const URL_ING    = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=688098548&single=true&output=csv";
const URL_PASOS  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=1382429978&single=true&output=csv";

const IMG = "assets/img/";

async function csv(url){
    let t = await (await fetch(url)).text();
    t = t.replace(/\r/g,"");
    let rows=t.split("\n").map(r=>r.split(","));
    const head=rows.shift();
    return rows.map(r=>Object.fromEntries(r.map((v,i)=>[head[i],v.trim()])));
}

let P=[],I=[],S=[];
start();

async function start(){
    P = await csv(URL_PLATOS);
    I = await csv(URL_ING);
    S = await csv(URL_PASOS);
    list();
}

function list(){
    gallery.innerHTML = P.map(p=>`
        <div class="card" onclick="openRecipe('${p.codigo}')">
            <img src="${IMG + (p.imagen_archivo||p.codigo+'.jpg')}">
            <h3>${p.nombre_plato}</h3>
            <p>${p["tiempo_preparacion(min)"]} min · ${p.porciones} porciones</p>
        </div>`).join("");
}

function openRecipe(id){
    const x=P.find(r=>r.codigo===id);

    mName.textContent = x.nombre_plato;
    mInfo.textContent = x["tiempo_preparacion(min)"]+" min · "+x.porciones+" porciones";

    videoFrame.src = x.youtube_id ? `https://www.youtube.com/embed/${x.youtube_id}` : "";
    modalImg.src   = IMG + (x.imagen_archivo||x.codigo+".jpg");

    mIng.innerHTML = I.filter(i=>i.codigo_plato===id).map(i=>`<li>${i.ingrediente} — ${i.cantidad||'-'}</li>`).join("");
    mSteps.innerHTML = S.filter(s=>s.codigo===id).sort((a,b)=>a.orden-b.orden).map(s=>`<li>${s.indicacion}</li>`).join("");

    modal.classList.remove("hidden");
}

function closeRecipe(){
    modal.classList.add("hidden");
    videoFrame.src=""; // 🔥 detiene reproducción
}
