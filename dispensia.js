/* ===================== DATA ===================== */
const URL_PLATOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=0&single=true&output=csv";
const URL_ING    = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=688098548&single=true&output=csv";
const URL_PASOS  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=1382429978&single=true&output=csv";

const IMG = "assets/img/"; // 📌 carpeta donde tienes las imágenes

/* ========= CSV PARSER NO MODIFICAR ========= */
async function csv(u){
  let t = await (await fetch(u)).text();
  t = t.replace(/\r/g,"");
  const r=t.split("\n").map(x=>x.split(","));
  const h=r.shift();
  return r.map(row => Object.fromEntries(row.map((v,i)=>[h[i],v.trim()])));
}

/* ================= INIT ================= */
let P=[], I=[], S=[];
init();
async function init(){
  P=await csv(URL_PLATOS);
  I=await csv(URL_ING);
  S=await csv(URL_PASOS);
  drawGallery();
}

/* ================= GALLERY ================= */
function drawGallery(){
  gallery.innerHTML=P.map(p=>`
    <div class="card" onclick="openRecipe('${p.codigo}')">
      <img src="${IMG+(p.imagen_archivo || p.codigo+'.jpg')}">
      <div class="card-body">
        <h3>${p.nombre_plato}</h3>
        <p>${p["tiempo_preparacion(min)"]} min • ${p.porciones} porciones</p>
        <button>Ver receta</button>
      </div>
    </div>
  `).join("");
}

/* ================= MODAL ================= */
function openRecipe(id){
  const r = P.find(x=>x.codigo===id);

  modalName.textContent=r.nombre_plato;
  modalTime.textContent=r["tiempo_preparacion(min)"]+" min";
  modalPortions.textContent=r.porciones+" porciones";

  /* ================= VIDEO YOUTUBE ==============
     📌 Debes tener en tu Google Sheet una columna llamada "youtube_id"
     Ejemplo:  dQw4w9WgXcQ
  ================================================= */
  recipeVideo.src = r.youtube_id ? 
      `https://www.youtube.com/embed/${r.youtube_id}?autoplay=1` 
      : "";

  modalIngredients.innerHTML = I.filter(x=>x.codigo_plato===id)
      .map(x=>`<li>${x.ingrediente} — ${x.cantidad||"-"}</li>`).join("");

  modalSteps.innerHTML = S.filter(x=>x.codigo===id)
      .sort((a,b)=>a.orden-b.orden)
      .map(x=>`<li>${x.indicacion}</li>`).join("");

  recipeModal.style.display="flex";
}

function closeRecipe(){
  recipeModal.style.display="none";
  recipeVideo.src=""; // detiene el video
}
