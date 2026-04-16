document.addEventListener("DOMContentLoaded",()=>{
  const chatListScreen=document.getElementById("chatListScreen");
  const chatScreen=document.getElementById("chatScreen");
  const backBtn=document.getElementById("backBtn");
  const headerAv=document.getElementById("headerAv");
  const headerName=document.getElementById("headerName");
  const headerStatus=document.getElementById("headerStatus");
  const chAvWrap=document.getElementById("chAvWrap");
  const msgInput=document.getElementById("msgInput");
  const msgBar=document.getElementById("msgBar");
  const keyboard=document.getElementById("keyboard");
  const hideKb=document.getElementById("hideKb");
  const lettersLayout=document.getElementById("lettersLayout");
  const numbersLayout=document.getElementById("numbersLayout");
  const kbLinkIn=document.getElementById("kbLinkIn");
  const kbStatus=document.getElementById("kbStatus");
  const linkAlert=document.getElementById("linkAlert");
  const laIcon=document.getElementById("laIcon");
  const laLabel=document.getElementById("laLabel");
  const laMsg=document.getElementById("laMsg");
  const laInfoBtn=document.getElementById("laInfoBtn");
  const infoPanel=document.getElementById("infoPanel");
  const ipClose=document.getElementById("ipClose");
  const detailsContent=document.getElementById("detailsContent");
  const tabDetails=document.getElementById("tabDetails");
  const tabAi=document.getElementById("tabAi");
  const paneDetails=document.getElementById("paneDetails");
  const paneAi=document.getElementById("paneAi");
  const aiMsgs=document.getElementById("aiMsgs");
  const aiInput=document.getElementById("aiInput");
  const aiSendBtn=document.getElementById("aiSendBtn");
  const aiChips=document.getElementById("aiChips");
  const aiSuggestionsToggle=document.getElementById("aiSuggestionsToggle");
  const aiInputRow=document.getElementById("aiInputRow");
  const aiModeBadge=document.getElementById("aiModeBadge");
  const photoViewer=document.getElementById("photoViewer");
  const pvClose=document.getElementById("pvClose");
  const pvName=document.getElementById("pvName");
  const pvStatus=document.getElementById("pvStatus");
  const pvAvBig=document.getElementById("pvAvBig");

  let analysis=null,shiftOn=false,currentChat=null,activeTab="details",aiReady=false;
  let convHistory=[];
  let lastAiLink="";

  function esc(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  function normDomain(s){return(s||"").toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"").split(/[/?#]/)[0]}
  function dbLookup(url){const h=normDomain(url);return LINK_DB.find(e=>normDomain(e.domain)===h)||LINK_DB.find(e=>h.endsWith("."+normDomain(e.domain))||h===normDomain(e.domain))||null}

  const WHOIS={
    "www.google.com":      {registrar:"MarkMonitor",asn:"AS15169",cert:"Google Trust Services",expira:"2026-09-14",score:98},
    "www.youtube.com":     {registrar:"MarkMonitor",asn:"AS15169",cert:"Google Trust Services",expira:"2026-02-14",score:97},
    "www.instagram.com":   {registrar:"MarkMonitor",asn:"AS32934",cert:"DigiCert",expira:"2026-04-05",score:97},
    "www.facebook.com":    {registrar:"MarkMonitor",asn:"AS32934",cert:"DigiCert",expira:"2026-03-28",score:98},
    "www.whatsapp.com":    {registrar:"MarkMonitor",asn:"AS32934",cert:"DigiCert",expira:"2026-09-17",score:97},
    "www.netflix.com":     {registrar:"MarkMonitor",asn:"AS2906", cert:"DigiCert",expira:"2026-11-09",score:96},
    "www.mercadolivre.com.br":{registrar:"Registro.br",asn:"AS27699",cert:"DigiCert",expira:"2026-08-01",score:95},
    "nubank.com.br":       {registrar:"Registro.br",asn:"AS396982",cert:"Let's Encrypt",expira:"2026-03-06",score:96},
    "www.itau.com.br":     {registrar:"Registro.br",asn:"AS7992",cert:"DigiCert",expira:"2026-04-21",score:97},
    "www.bb.com.br":       {registrar:"Registro.br",asn:"AS7992",cert:"DigiCert",expira:"2026-06-09",score:97},
    "www.amazon.com":      {registrar:"MarkMonitor",asn:"AS16509",cert:"DigiCert",expira:"2026-10-31",score:98},
    "www.gov.br":          {registrar:"Registro.br (Serpro)",asn:"AS10586",cert:"Serpro CA",expira:"2026-12-31",score:99},
    "meuapp-verificado.com":{registrar:"GoDaddy",asn:"AS16509",cert:"Let's Encrypt",expira:"2026-05-01",score:82},
    "www.boticario.com.br":{registrar:"Registro.br",asn:"AS27699",cert:"DigiCert",expira:"2026-01-01",score:95},
    "bit.ly":              {registrar:"GoDaddy",asn:"AS30148",cert:"DigiCert",expira:"2026-07-13",score:55},
    "tinyurl.com":         {registrar:"Network Solutions",asn:"AS13335",cert:"Cloudflare",expira:"2026-01-01",score:52},
    "conta-segura-banco.com":{registrar:"Namecheap",asn:"AS22612",cert:"Sem certificado válido",expira:"2026-03-14",score:4},
    "login-facebook-seguro.com":{registrar:"Namecheap",asn:"AS22612",cert:"Let's Encrypt (expirado)",expira:"2025-12-09",score:2},
    "suporte-whatsapp-verificacao.com":{registrar:"NameSilo",asn:"AS22612",cert:"Sem HTTPS válido",expira:"2026-01-09",score:1},
    "premio-pix-nubank.com":{registrar:"NameSilo",asn:"AS22612",cert:"Let's Encrypt",expira:"2026-02-19",score:3},
    "pix-premiado-brasil.com":{registrar:"Namecheap",asn:"AS22612",cert:"Let's Encrypt",expira:"2025-11-04",score:2},
    "netflix-atualizar-pagamento.com":{registrar:"GoDaddy",asn:"AS22612",cert:"Let's Encrypt",expira:"2026-01-29",score:3},
    "rastreio-correios-br.com":{registrar:"NameSilo",asn:"AS22612",cert:"Let's Encrypt",expira:"2025-10-11",score:2},
    "gov-br-servicos.online":{registrar:"Namecheap",asn:"AS22612",cert:"Let's Encrypt",expira:"2026-02-28",score:2}
  };

  function calcAge(d){if(!d)return null;const days=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(days<30)return`${days} dias ⚠`;if(days<365)return`${Math.floor(days/30)} meses`;const y=Math.floor(days/365),m=Math.floor((days%365)/30);return m>0?`${y} ano${y>1?"s":""} e ${m} mês${m>1?"es":""}` :`${y} ano${y>1?"s":""}`}

  function scoreBar(s){const c=s>=80?"#3fb950":s>=50?"#d29922":"#f85149";const f=Math.round(s/10);return Array.from({length:10},(_,i)=>`<span style="display:inline-block;width:7px;height:9px;border-radius:2px;background:${i<f?c:"#30363d"};margin-right:2px"></span>`).join("")+`<span style="color:${c};font-weight:700;margin-left:3px">${s}/100</span>`}

  function analyze(url){
    const raw=(url||"").trim();
    if(!raw)return{level:"empty",label:"Cole um link para analisar",color:"#6b7280",short:"",badgeCls:"rb-empty",raw:"",info:null,html:`<div class="det-placeholder">Cole um link na barra do teclado e toque em <strong>VER INFO</strong>.</div>`};
    let full=/^https?:\/\//i.test(raw)?raw:"https://"+raw;
    let parsed;try{parsed=new URL(full)}catch{return{level:"suspicious",label:"Formato inválido",color:"#f0883e",short:"Não parece um link válido.",badgeCls:"rb-suspect",raw,info:null,html:`<div style="padding:10px 12px;font-size:11.5px;color:#cdd9e5">Endereço inválido. Confirme com quem enviou.</div>`}}
    const proto=parsed.protocol,host=parsed.hostname.toLowerCase(),path=parsed.pathname+(parsed.search||"");
    const info=dbLookup(raw),whois=WHOIS[normDomain(raw)]||null;
    const notes=[];let level="unknown",color="#d29922",label="Link desconhecido",badgeCls="rb-unknown",short="Não está na base. Verifique antes de clicar.";
    if(proto==="http:"){notes.push("Conexão HTTP — sem criptografia.");level="danger";color="#f85149";label="Conexão insegura (HTTP)";badgeCls="rb-danger";short="Evite inserir dados nesse site."}
    const badTLDs=[".ru",".cn",".tk",".top",".ml",".online",".xyz",".click"];
    if(badTLDs.some(t=>host.endsWith(t))){notes.push("Extensão de domínio associada a golpes.");if(level!=="danger"){level="suspicious";color="#f0883e";label="Domínio potencialmente arriscado";badgeCls="rb-suspect";short="Extensão comum em golpes."}}
    const shorteners=["bit.ly","tinyurl.com","is.gd","cutt.ly","t.co","ow.ly"];
    if(shorteners.some(d=>host===d)){notes.push("Link encurtado — destino real oculto.");if(level!=="danger"){level="suspicious";color="#f0883e";label="Link encurtado";badgeCls="rb-suspect";short="O destino real está escondido."}}
    if(info){const r=info.risco;if(r==="baixo"){level="safe";color="#3fb950";label="✓ Domínio reconhecido";badgeCls="rb-safe";short="Domínio confiável na base do Teclado Protetor."}if(r==="médio"){level="suspicious";color="#f0883e";label="Link suspeito";badgeCls="rb-suspect";short="Requer atenção antes de clicar."}if(r==="alto"){level="danger";color="#f85149";label="⚠ Link perigoso";badgeCls="rb-danger";short="Domínio associado a golpes."}if(r==="crítico"){level="danger";color="#f85149";label="⛔ Phishing conhecido";badgeCls="rb-danger";short="Página falsa identificada. Não clique!"}}
    const html=buildHtml({raw,proto,host,path,info,whois,notes,level,badgeCls});
    return{level,label,color,short,badgeCls,raw,host,path,info,whois,html}
  }

  function buildHtml({raw,proto,host,path,info,whois,notes,level,badgeCls}){
    const rL={safe:"✓ SEGURO",suspicious:"⚠ SUSPEITO",danger:"✕ PERIGOSO",unknown:"? DESCONHECIDO"};
    const age=info?calcAge(info.criadoEm):null,score=whois?.score??null;
    const sec=t=>`<div style="padding:5px 12px 3px;font-size:9.5px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#484f58;border-top:1px solid #21262d;margin-top:5px">${t}</div>`;
    const row=(k,v)=>`<div style="display:flex;padding:2px 12px;gap:6px;font-size:11.5px"><span style="color:#6e7681;min-width:100px;flex-shrink:0">${k}</span><span style="color:#cdd9e5;word-break:break-all">${v}</span></div>`;
    const warn=t=>`<div style="margin:4px 12px;padding:6px 10px;background:#2d0f0f;border-left:3px solid #f85149;border-radius:4px;font-size:11px;color:#f87171;line-height:1.5">${t}</div>`;
    const good=t=>`<div style="margin:4px 12px;padding:6px 10px;background:#0a1f15;border-left:3px solid #3fb950;border-radius:4px;font-size:11px;color:#7ee787;line-height:1.5">${t}</div>`;
    const caution=t=>`<div style="margin:4px 12px;padding:6px 10px;background:#1c1a00;border-left:3px solid #d29922;border-radius:4px;font-size:11px;color:#e3b341;line-height:1.5">${t}</div>`;
    let h=`<div style="padding:8px 12px 4px;display:flex;flex-wrap:wrap;align-items:center;gap:7px"><span class="risk-badge ${badgeCls}">${rL[level]||"?"}</span>`;
    if(info)h+=`<span style="font-size:11.5px;color:#8b949e;font-weight:600">${esc(info.nome)}</span>`;
    if(score!==null)h+=`<div style="width:100%;margin-top:4px;font-size:10.5px;color:#8b949e">Reputação: ${scoreBar(score)}</div>`;
    h+=`</div>`;
    h+=sec("Identificação");h+=row("URL",esc(raw));h+=row("Domínio",esc(host));h+=row("Caminho",path&&path!=="/"?esc(path):"/ (raiz)");h+=row("Protocolo",proto==="https:"?"HTTPS ✓ (criptografado)":"HTTP ✗ (sem criptografia)");
    if(info){h+=sec("Dados Técnicos");h+=row("IP",info.ip);h+=row("País",info.pais);h+=row("Provedor",`${info.provedor}${whois?" · "+whois.asn:""}`);h+=row("Categoria",info.categoria);if(whois){h+=row("Registrador",whois.registrar);h+=row("SSL",whois.cert)}h+=sec("Datas");h+=row("Registrado",info.criadoEm+(age?` (${age} atrás)`:""));h+=row("Expira",whois?.expira||"—");h+=row("Último scan",info.ultimoScan);if(age&&(info.risco==="alto"||info.risco==="crítico"))h+=warn(`⚠ Domínio criado há apenas ${age} — padrão típico de golpes.`);h+=sec("Reputação");h+=row("Nível",`${info.risco.toUpperCase()} · ${info.reputacao}`);if(info.tipoAlvo)h+=row("Alvo",info.tipoAlvo);if(info.risco==="alto"||info.risco==="crítico"||info.risco==="médio"){h+=sec("Ameaça");if(info.tecnicaAtaque)h+=row("Técnica",esc(info.tecnicaAtaque));if(info.ultimaCampanhaDetectada)h+=row("Última campanha",esc(info.ultimaCampanhaDetectada));info.incidentes?.forEach(i=>h+=warn(esc(i)))}h+=sec("Observações");if(info.risco==="baixo")info.observacoes?.forEach(o=>h+=good(esc(o)));else if(info.risco==="médio")info.observacoes?.forEach(o=>h+=caution(esc(o)));else info.observacoes?.forEach(o=>h+=warn(esc(o)))}else{h+=sec("Análise Automática");if(notes.length)notes.forEach(n=>h+=warn(n));else h+=caution("Domínio não encontrado na base. Não é necessariamente golpe, mas não foi verificado.")}
    h+=`<div style="padding:6px 12px 10px;font-size:10px;color:#484f58;font-style:italic;border-top:1px solid #21262d;margin-top:6px">Análise com IA Claude · dados de reputação simulados para demo</div>`;
    return h
  }

  function renderAnalysis(a){
    analysis=a;
    kbStatus.textContent=a.label;kbStatus.style.color=a.color;
    if(a.level==="empty"){linkAlert.classList.add("hidden");msgBar.style.borderColor="transparent";msgBar.style.boxShadow="none"}
    else{
      linkAlert.classList.remove("hidden");
      laMsg.textContent=a.short;
      linkAlert.style.borderLeftColor=a.color;
      msgBar.style.borderColor=a.color;
      msgBar.style.boxShadow=`0 0 0 2px ${a.color}33`;
      if(a.level==="safe"){laIcon.textContent="✅";laLabel.textContent="LINK SEGURO";laLabel.style.color="#3fb950";laInfoBtn.style.background="#0a1f15";laInfoBtn.style.color="#3fb950";laInfoBtn.style.border="1px solid #238636"}
      else if(a.level==="danger"){laIcon.textContent="⛔";laLabel.textContent="ATENÇÃO — LINK PERIGOSO";laLabel.style.color="#f85149";laInfoBtn.style.background="#3d0000";laInfoBtn.style.color="#f85149";laInfoBtn.style.border="1px solid #8b1a1a"}
      else if(a.level==="suspicious"){laIcon.textContent="⚠️";laLabel.textContent="LINK SUSPEITO";laLabel.style.color="#f0883e";laInfoBtn.style.background="#341700";laInfoBtn.style.color="#f0883e";laInfoBtn.style.border="1px solid #7a3800"}
      else{laIcon.textContent="🔍";laLabel.textContent="LINK DESCONHECIDO";laLabel.style.color="#d29922";laInfoBtn.style.background="#1c1c00";laInfoBtn.style.color="#d29922";laInfoBtn.style.border="1px solid #4d3800"}
    }
    if(paneDetails.classList.contains("active"))detailsContent.innerHTML=a.html
  }

  // ── Navigation ──
  document.querySelectorAll(".chat-item").forEach(item=>{
    item.querySelector(".av").addEventListener("click",e=>{
      e.stopPropagation();
      openPV(item.dataset.name,item.dataset.status,item.dataset.av,item.dataset.avbg,item.dataset.chat);
    });
    item.addEventListener("click",e=>{
      if(!e.target.closest(".av")) openChat(item);
    });
  });
  chAvWrap.addEventListener("click",()=>openPV(headerName.textContent,headerStatus.textContent,headerAv.textContent,headerAv.style.background,currentChat));

  const CHAT_ID_MAP={devyn:"convoDevyn",host:"convoHost",family:"convoFamily",grandma:"convoGrandma",promo:"convoPromo",agency:"convoAgency",bank:"convoBank",friend:"convoFriend",work:"convoWork"};

  function openChat(item){
    currentChat=item.dataset.chat;
    headerName.textContent=item.dataset.name;
    headerStatus.textContent=item.dataset.status;
    // Embaça número/nome para o chat de promoções
    const isPromo=item.dataset.chat==="promo";
    headerName.classList.toggle("blurred", isPromo);
    headerStatus.classList.toggle("blurred", isPromo);
    const chatKey=item.dataset.chat;
    if(AVATAR_MAP[chatKey]){
      headerAv.innerHTML=`<img src="${AVATAR_MAP[chatKey]}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      headerAv.style.background="transparent";
    } else {
      headerAv.innerHTML="";
      headerAv.textContent=item.dataset.av;
      headerAv.style.background=item.dataset.avbg||"#128c7e";
      headerAv.style.color=item.dataset.avcolor||"#fff";
    }
    // esconde todos
    document.querySelectorAll("[id^='convo']").forEach(c=>c.classList.add("hidden"));
    // abre o correto via mapa explícito
    const convoId=CHAT_ID_MAP[currentChat];
    const c=convoId?document.getElementById(convoId):null;
    if(c){c.classList.remove("hidden");setTimeout(()=>c.scrollTop=c.scrollHeight,80);}
    chatListScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    closeKb(true);
  }

  backBtn.addEventListener("click",()=>{chatScreen.classList.add("hidden");chatListScreen.classList.remove("hidden");closeKb(true)});

  function openPV(name,status,av,bg,chatKey){
    pvName.textContent=name;pvStatus.textContent=status;
    if(chatKey&&AVATAR_MAP[chatKey]){
      pvAvBig.innerHTML=`<img src="${AVATAR_MAP[chatKey]}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      pvAvBig.style.background="transparent";
    } else {
      pvAvBig.innerHTML="";pvAvBig.textContent=av;pvAvBig.style.background=bg||"#128c7e";
    }
    photoViewer.classList.remove("hidden");
  }
  pvClose.addEventListener("click",()=>photoViewer.classList.add("hidden"));

  // ── Keyboard ──
  [msgInput,msgBar].forEach(el=>el.addEventListener("click",openKb));
  hideKb.addEventListener("click",()=>closeKb(false));
  function openKb(){keyboard.classList.add("open");if(analysis&&analysis.level!=="empty")linkAlert.classList.remove("hidden");scrollConvo()}
  function closeKb(reset){keyboard.classList.remove("open");linkAlert.classList.add("hidden");infoPanel.classList.add("hidden");if(reset){kbLinkIn.value="";renderAnalysis(analyze(""))}scrollConvo()}
  function scrollConvo(){if(!currentChat)return;const convoId=CHAT_ID_MAP[currentChat];const c=convoId?document.getElementById(convoId):null;if(c)setTimeout(()=>c.scrollTop=c.scrollHeight,80);}

  // ── Keys ──
  document.querySelectorAll(".key").forEach(key=>{
    key.addEventListener("click",()=>{
      key.classList.add("pressed");setTimeout(()=>key.classList.remove("pressed"),100);
      const a=key.dataset.a,t=key.textContent.trim();
      if(a==="shift"){shiftOn=!shiftOn;document.querySelectorAll(".kb-layout.on .key:not(.key-sp)").forEach(k=>k.textContent=shiftOn?k.textContent.toUpperCase():k.textContent.toLowerCase())}
      else if(a==="backspace"){if(msgInput.value.length)msgInput.value=msgInput.value.slice(0,-1)}
      else if(a==="numbers"){lettersLayout.classList.remove("on");numbersLayout.classList.add("on")}
      else if(a==="letters"){numbersLayout.classList.remove("on");lettersLayout.classList.add("on")}
      else if(a==="comma"){msgInput.value+=","}
      else if(a==="dot"){msgInput.value+="."}
      else if(a==="space"){msgInput.value+=" "}
      else if(a==="emoji"){msgInput.value+="😊"}
      else if(a==="enter"){/* send */}
      else if(!a&&t){msgInput.value+=shiftOn?t.toUpperCase():t.toLowerCase()}
    })
  });

  // ── Link input ──
  kbLinkIn.addEventListener("input",()=>{
    const a=analyze(kbLinkIn.value);
    renderAnalysis(a);
    // Se o link mudou, marca o chat como desatualizado para reiniciar quando abrir
    const newLink=(kbLinkIn.value||"").trim();
    if(newLink!==lastAiLink){
      aiReady=false;
      convHistory=[];
      aiMsgs.innerHTML="";
    }
  });
  kbLinkIn.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();openPanel("details")}});
  laInfoBtn.addEventListener("click",()=>openPanel("details"));

  // ── Info panel ──
  function openPanel(tab){const a=analyze(kbLinkIn.value);analysis=a;detailsContent.innerHTML=a.html;infoPanel.classList.remove("hidden");switchTab(tab||activeTab);scrollConvo()}
  ipClose.addEventListener("click",()=>{infoPanel.classList.add("hidden");scrollConvo()});
  tabDetails.addEventListener("click",()=>switchTab("details"));
  tabAi.addEventListener("click",()=>switchTab("ai"));

  const ipContent=document.querySelector(".ip-content");

  function switchTab(tab){
    activeTab=tab;
    tabDetails.classList.toggle("active",tab==="details");
    tabAi.classList.toggle("active",tab==="ai");
    paneDetails.classList.toggle("active",tab==="details");
    paneAi.classList.toggle("active",tab==="ai");
    // input row e badge: visíveis na aba IA
    aiInputRow.classList.toggle("hidden",tab!=="ai");
    aiModeBadge.classList.toggle("hidden",tab!=="ai");
    // chips: sempre fechados ao trocar de aba
    aiChips.classList.add("hidden");
    if(aiSuggestionsToggle) aiSuggestionsToggle.classList.remove("active");
    if(tab==="details")detailsContent.innerHTML=(analysis||analyze("")).html;
    if(tab==="ai"){
      if(!aiReady)initAi();
      setTimeout(()=>{ipContent.scrollTop=ipContent.scrollHeight;aiInput.focus()},80);
    }
  }

  // IA CLAUDE
  const CHIPS={
    empty:[{q:"Como o Teclado Protetor funciona?"},{q:"Quais golpes são mais comuns no Brasil?"},{q:"Como identificar um link falso?"},{q:"O que é phishing?"}],
    safe_bank:[{q:"Como golpistas imitam bancos?"},{q:"O que nunca devo fazer no site do banco?"},{q:"O banco pode me ligar pedindo senha?"},{q:"Como ativar autenticação em dois fatores?"}],
    safe_social:[{q:"Como proteger minha conta no Instagram?"},{q:"Como sei se minha conta foi invadida?"},{q:"O que fazer se clonaram meu WhatsApp?"},{q:"Como golpistas usam redes sociais?"}],
    safe_ecommerce:[{q:"Como comprar online com segurança?"},{q:"O que verificar antes de pagar?"},{q:"Golpes comuns em e-commerce no Brasil?"},{q:"Como identificar uma loja falsa?"}],
    safe_gov:[{q:"Como reconhecer sites governamentais reais?"},{q:"Golpes comuns usando o nome do governo?"},{q:"O que é phishing de benefício social?"},{q:"O que fazer se cair num golpe do Gov.br?"}],
    safe_generic:[{q:"Como confirmar se este site é legítimo?"},{q:"O que verificar antes de clicar num link?"},{q:"Quais sinais indicam um site confiável?"},{q:"Como golpistas imitam empresas legítimas?"}],
    safe_streaming:[{q:"Como evitar golpes de streaming?"},{q:"Como golpistas imitam Netflix e Spotify?"},{q:"Assinatura grátis pode ser golpe?"},{q:"Como cancelar uma assinatura falsa?"}],
    suspicious:[{q:"Por que esse link é suspeito?"},{q:"É seguro continuar ou devo ignorar?"},{q:"Como confirmar com quem enviou?"},{q:"O que faço se já cliquei?"}],
    shortener:[{q:"Por que links encurtados são arriscados?"},{q:"Como ver o destino real de um link encurtado?"},{q:"Devo clicar nesse link?"},{q:"Quais encurtadores são mais seguros?"}],
    danger_bank:[{q:"Como esse golpe bancário funciona?"},{q:"O que fazer se já inseri meus dados?"},{q:"Como contestar uma transação fraudulenta?"},{q:"Devo ligar pro banco agora?"}],
    danger_social:[{q:"Como esse golpe de rede social funciona?"},{q:"Minha conta pode ter sido comprometida?"},{q:"Como recuperar uma conta invadida?"},{q:"Devo avisar meus contatos?"}],
    danger_pix:[{q:"Como funciona o golpe do PIX premiado?"},{q:"Já transferi dinheiro — consigo recuperar?"},{q:"Como denunciar esse golpe?"},{q:"Quem devo contatar agora?"}],
    danger_delivery:[{q:"Como funciona o golpe de entrega falsa?"},{q:"Fui cobrado por taxa falsa — o que faço?"},{q:"Como rastrear minha encomenda com segurança?"},{q:"Devo reportar esse número de SMS?"}],
    danger_whatsapp:[{q:"Como funciona a clonagem de WhatsApp?"},{q:"Já informei o código — o que faço agora?"},{q:"Como recuperar minha conta do WhatsApp?"},{q:"Devo avisar meus contatos?"}],
    danger_generic:[{q:"Como esse golpe funciona?"},{q:"O que fazer se já cliquei?"},{q:"Como denunciar esse link?"},{q:"Quem devo avisar?"}],
    unknown:[{q:"Como avaliar um link desconhecido?"},{q:"O que verificar nesse domínio?"},{q:"Sinais de que um link é falso?"},{q:"Como denunciar um link suspeito?"}]
  };

  function getChipKey(a){
    if(!a||a.level==="empty") return "empty";
    const cat=(a.info?.categoria||"").toLowerCase();
    const tech=(a.info?.tecnicaAtaque||"").toLowerCase();
    if(a.level==="suspicious"){
      if(cat.includes("encurtador")) return "shortener";
      return "suspicious";
    }
    if(a.level==="safe"){
      if(cat.includes("banco")||cat.includes("digital")) return "safe_bank";
      if(cat.includes("rede social")||cat.includes("mensageria")) return "safe_social";
      if(cat.includes("streaming")) return "safe_streaming";
      if(cat.includes("e-commerce")||cat.includes("marketplace")) return "safe_ecommerce";
      if(cat.includes("publico")||cat.includes("gov")||cat.includes("servico")) return "safe_gov";
      return "safe_generic";
    }
    if(a.level==="danger"){
      if(cat.includes("banc")||tech.includes("cadastro")) return "danger_bank";
      if(cat.includes("pix")||cat.includes("financeiro")||tech.includes("pix")) return "danger_pix";
      if(cat.includes("entrega")||tech.includes("rastreio")||tech.includes("sms")) return "danger_delivery";
      if(cat.includes("mensageria")||tech.includes("whatsapp")) return "danger_whatsapp";
      if(cat.includes("social")||tech.includes("login")) return "danger_social";
      return "danger_generic";
    }
    return "unknown";
  }

  function buildChips(a){
    const key=getChipKey(a);
    const list=CHIPS[key]||CHIPS.unknown;
    aiChips.innerHTML=list.map(c=>`<button class="ai-chip" data-q="${c.q}">${c.q}</button>`).join("");
    aiChips.querySelectorAll(".ai-chip").forEach(chip=>{
      chip.addEventListener("click",()=>{
        aiInput.value=chip.dataset.q;
        // Fecha chips e limpa toggle ao selecionar uma sugestão
        aiChips.classList.add("hidden");
        if(aiSuggestionsToggle) aiSuggestionsToggle.classList.remove("active");
        sendAi();
      });
    });
    // Chips sempre fechados ao reconstruir
    aiChips.classList.add("hidden");
    if(aiSuggestionsToggle) aiSuggestionsToggle.classList.remove("active");
  }

  async function initAi(){
    aiReady=true;
    lastAiLink=(kbLinkIn.value||"").trim();
    const a=analysis||analyze(kbLinkIn.value);
    buildChips(a);
    if(a.level==="empty"){
      addBot("Olá! 👋 Sou o <strong>Assistente de Segurança</strong> do Teclado Protetor.<br><br>Cole um link na barra acima e eu analiso se é seguro ou golpe, usando dados de reputação e IA. Use os atalhos abaixo para começar. 🛡️");
      return;
    }
    // Bloqueia envio enquanto a mensagem de boas-vindas carrega
    aiSendBtn.disabled=true;
    aiInput.disabled=true;
    const thinking=addThinking();
    try{
      const welcomeMsg=await callClaudeWelcome(a);
      thinking.remove();
      addBot(welcomeMsg);
    }catch(e){
      thinking.remove();
      addBot(buildWelcomeFallback(a));
    }finally{
      aiSendBtn.disabled=false;
      aiInput.disabled=false;
      setTimeout(()=>aiInput.focus(),50);
    }
  }

  async function callClaudeWelcome(a){
    const tools=a.level!=="empty"?buildToolData(a):null;
    const toolCtx=tools?`\nVirusTotal: ${tools.vt.nota} | Veredicto: ${tools.vt.veredicto}\nGoogle Safe Browsing: ${tools.sb.nota} | Veredicto: ${tools.sb.veredicto}\nWHOIS/Idade: ${tools.wh.nota} | Nivel: ${tools.wh.nivel}`:"";
    const linkCtx=`Link analisado: ${a.raw}
Classificação: ${a.level.toUpperCase()} — ${a.label}
Resumo: ${a.short}
${a.info?`Serviço: ${a.info.nome} | Categoria: ${a.info.categoria} | País: ${a.info.pais}
Criado em: ${a.info.criadoEm} | Alvo: ${a.info.tipoAlvo}`:"Domínio não está na base"}
${a.info?.tecnicaAtaque?`Técnica de ataque: ${a.info.tecnicaAtaque}`:""}
${a.info?.ultimaCampanhaDetectada?`Última campanha: ${a.info.ultimaCampanhaDetectada}`:""}
${a.info?.incidentes?.length?`Incidentes: ${a.info.incidentes.join(" | ")}`:""}
${a.info?.observacoes?.length?`Observações: ${a.info.observacoes.join(" | ")}`:""}${toolCtx}`;

    const system=`Você é o Assistente de Segurança do Teclado Protetor — teclado Android que analisa links suspeitos em tempo real.

O usuário acabou de abrir o chat e você já analisou o link colado. Escreva a PRIMEIRA mensagem do chat — a saudação inicial — com base nos dados reais do link.

REGRAS:
1. A mensagem deve ser ESPECÍFICA para esse link e esse tipo de ameaça (ou confirmação de segurança). Não seja genérico.
2. Use os dados concretos: nome do serviço imitado, técnica de ataque, incidentes, campanha detectada.
3. Linguagem acessível, português brasileiro claro, para qualquer pessoa inclusive idosos.
4. Máximo 3 parágrafos curtos.
5. Tom: link seguro = tranquilo e confirmativo. Link perigoso = firme, calmo, orientando ação imediata. Nunca alarmista sem base.
6. Termine com UMA pergunta ou convite de ação relevante para o contexto (ex: "Quer saber como esse golpe funciona?" ou "Já clicou? Me conta e eu te oriento.").
7. Use HTML simples: <strong>, <br>, <em>. Sem markdown.
8. NÃO comece com "Olá" genérico, vá direto para o diagnóstico do link.

DADOS DO LINK:
${linkCtx}`;

    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system,messages:[{role:"user",content:"Gere a mensagem de abertura do chat para esse link."}]})});
    if(!resp.ok){const err=await resp.json().catch(()=>({}));throw new Error(err.error?.message||`HTTP ${resp.status}`)}
    const data=await resp.json();
    const text=data.content?.find(b=>b.type==="text")?.text;
    if(!text)throw new Error("Resposta vazia");
    return text;
  }

  function buildWelcomeFallback(a){
    const cat=(a.info?.categoria||"").toLowerCase();
    const obs0=a.info?.observacoes?.[0]||"";
    if(a.level==="safe") return`✅ <strong>${esc(a.info?.nome||a.host)}</strong> está na nossa base como domínio confiável.<br><br>${obs0?esc(obs0)+"<br><br>":""}Tem alguma dúvida sobre segurança digital?`;
    if(a.level==="danger"){
      if(cat.includes("banc")) return`⛔ <strong>Phishing bancário detectado!</strong><br><br>${obs0?esc(obs0)+"<br><br>":""}Se você já inseriu dados aqui, aja rápido — posso orientar o que fazer.`;
      if(cat.includes("pix")||cat.includes("financeiro")) return`⛔ <strong>Golpe de PIX detectado!</strong><br><br>${obs0?esc(obs0)+"<br><br>":""}Não clique e não compartilhe. Quer saber como esse golpe funciona?`;
      if(cat.includes("mensageria")||cat.includes("whatsapp")) return`⛔ <strong>Golpe de clonagem de WhatsApp!</strong><br><br>${obs0?esc(obs0)+"<br><br>":""}Se já informou algum código de 6 dígitos, registre seu número novamente agora.`;
      return`⛔ <strong>Link perigoso identificado!</strong><br><br>${obs0?esc(obs0)+"<br><br>":""}Não clique, não compartilhe e não insira dados. Posso explicar como esse golpe funciona.`;
    }
    if(a.level==="suspicious") return`⚠️ Link marcado como <strong>suspeito</strong>.<br><br>${esc(a.short)}<br><br>Antes de clicar, confirme com quem enviou por outro canal.`;
    return`🔍 O domínio <strong>${esc(a.host||a.raw)}</strong> não está na nossa base.<br><br>Recomendo cautela: verifique se há HTTPS e se a fonte é confiável.`;
  }

  // ── Dados de ferramentas externas (Abordagem 2) ──
  function buildToolData(a){
    const info=a.info||null;
    const mal=info?(info.risco==="critico"?45:info.risco==="alto"?28:info.risco==="medio"?3:0):0;
    const gsb=info?.gsb||"desconhecido";
    const vt={mal,total:72,veredicto:mal>3?"MALICIOSO":"LIMPO",nota:`${mal}/72 engines detectaram ameaca`};
    const sb={gsb,veredicto:gsb==="bloqueado"?"BLOQUEADO":gsb==="variavel"?"VARIAVEL":"LIMPO",nota:gsb==="bloqueado"?"Bloqueado pelo Google Safe Browsing":gsb==="variavel"?"Status variavel - depende do link especifico":"Nao consta em listas negras do Google"};
    const dias=info?Math.floor((Date.now()-new Date(info.criadoEm||"2000-01-01").getTime())/86400000):-1;
    const wh={dias,nivel:dias<0?"desconhecido":dias<30?"CRITICO":dias<180?"SUSPEITO":dias<365?"ATENCAO":"OK",nota:dias<0?"Dados indisponiveis":dias<30?`Criado ha apenas ${dias} dias - padrao de golpe`:dias<180?`Dominio recente: ${Math.floor(dias/30)} meses`:dias<365?`Tem menos de 1 ano (${dias} dias)`:`Estabelecido ha ${(dias/365).toFixed(1)} anos`};
    return{vt,sb,wh};
  }

  // ── Guardião de escopo — lógica de allowlist ──
  function isOffTopic(q){
    const raw=q.toLowerCase().trim();
    // Normaliza acentos
    const ql=raw.normalize("NFD").replace(/[\u0300-\u036f]/g,"");

    // 1. Saudações e meta-perguntas sobre o assistente → sempre deixa passar
    const saudacoes=["oi","ola","alo","tudo bem","boa tarde","bom dia","boa noite","como vai","quem e voce","qual seu nome","voce e ia","o que voce faz","me ajude","obrigado","obrigada","valeu","vlw","pode me ajudar"];
    if(saudacoes.some(g=>ql===g||ql.startsWith(g+" ")||ql.endsWith(" "+g))) return false;

    // 2. Palavras que claramente indicam segurança digital → deixa passar
    const onTopic=["link","golpe","phishing","scam","site","url","dominio","senha","pix","banco","fraude","hacker","virus","seguranca","cliquei","recebi","whatsapp","instagram","facebook","telegram","sms","email","conta","acesso","login","cadastro","token","codigo","verificacao","cartao","cpf","dados","roubo","clonagem","fake","falso","suspeito","perigoso","confiavel","correios","entrega","rastreio","nubank","itau","bradesco","caixa","bb","netflix","spotify","amazon","mercado livre","ifood","shopee","americanas","aplicativo","denunci","reportar","cert","procon","policia","banco central","reembolso","contestar","transacao","malware","ransomware","spyware","vpn","https","certificado","ataque","invasao","golpista","estelionato","crime","vitima","proteger","protecao","seguro","bloqueado","bloquearam","clonaram","invadiram","roubaram","hackearam","caiu","cai no","fui enganado","me enganaram","perdi dinheiro","transferencia","boleto","cobranca","cobrança"];
    if(onTopic.some(t=>ql.includes(t))) return false;

    // 3. Perguntas sobre o link atual → deixa passar
    const sobreLink=["o que e isso","o que e esse","esse link","esse site","esse dominio","e seguro","e perigoso","e golpe","e verdadeiro","e falso","posso clicar","devo clicar","pode ser golpe","como funciona","o que fazer","ja cliquei","ja inseri","ja mandei","ja paguei","como denunciar","como reportar","como recuperar","quem devo","o que acontece","por que","qual o risco","explica","me conta mais","fala mais","me diz","como identificar","como saber","como verificar","como proteger","como evitar"];
    if(sobreLink.some(t=>ql.includes(t))) return false;

    // 4. Tudo mais → fora do escopo
    return true;
  }

  async function sendAi(){
    const txt=aiInput.value.trim();if(!txt||aiSendBtn.disabled)return;
    aiInput.value="";aiSendBtn.disabled=true;addUser(txt);
    if(isOffTopic(txt)){
      addBot("🛡️ Só consigo ajudar com <strong>segurança de links e golpes digitais</strong>.<br><br>Você pode me perguntar sobre o link colado, como o golpe funciona, o que fazer se já clicou, ou como denunciar. Use os atalhos abaixo para começar.");
      aiSendBtn.disabled=false;return;
    }
    const thinking=addThinking();
    const a=analysis||analyze(kbLinkIn.value);
    try{
      const reply=await callClaude(txt,a);
      thinking.remove();addBot(reply);
      convHistory.push({role:"user",content:txt},{role:"assistant",content:reply});
      if(convHistory.length>16)convHistory=convHistory.slice(-16);
    }catch(e){
      thinking.remove();
      console.warn("Claude API erro:",e.message);
      addBot(fallback(txt,a));
    }
    aiSendBtn.disabled=false;
    setTimeout(()=>aiInput.focus(),50);
    scrollAi();
  }

  async function callClaude(question,a){
    const hasLink=a&&a.level!=="empty";
    const tools=hasLink?buildToolData(a):null;
    const toolCtx=tools?`\n\n=== DADOS DAS FERRAMENTAS (Abordagem 2) ===\nVirusTotal: ${tools.vt.nota} | Veredicto: ${tools.vt.veredicto}\nGoogle Safe Browsing: ${tools.sb.nota} | Veredicto: ${tools.sb.veredicto}\nWHOIS/Idade: ${tools.wh.nota} | Nivel de alerta: ${tools.wh.nivel}`:"";
    const linkCtx=!hasLink
      ?"Nenhum link colado ainda. Pergunta geral sobre seguranca digital."
      :`Link: ${a.raw}\nRisco: ${a.level.toUpperCase()} - ${a.label}\nResumo: ${a.short}\n${a.info?`Servico: ${a.info.nome} | Categoria: ${a.info.categoria} | Pais: ${a.info.pais}\nRegistrado em: ${a.info.criadoEm} | Alvo: ${a.info.tipoAlvo}`:"Dominio nao esta na base"}\n${a.info?.tecnicaAtaque?`Tecnica: ${a.info.tecnicaAtaque}`:""}\n${a.info?.ultimaCampanhaDetectada?`Ultima campanha: ${a.info.ultimaCampanhaDetectada}`:""}\n${a.info?.incidentes?.length?`Incidentes: ${a.info.incidentes.join(" | ")}`:""}${toolCtx}`;
    const system=`Voce e o Assistente de Seguranca do Teclado Protetor — teclado Android que analisa links suspeitos em tempo real.

CONTEXTO DO LINK ATUAL:
${linkCtx}

REGRAS ABSOLUTAS:
1. ESCOPO EXCLUSIVO: Responda SOMENTE sobre seguranca digital, links, golpes, phishing e protecao online. Se a pergunta for sobre culinaria, esportes, entretenimento, historia ou qualquer assunto nao relacionado, recuse educadamente em 1 frase e redirecione para seguranca digital.
2. SEJA ESPECIFICO: Use os dados das ferramentas. Nao seja generico quando ha dados concretos.
3. LINGUAGEM ACESSIVEL: Portugues brasileiro claro. Escreva para qualquer pessoa, inclusive idosos.
4. TAMANHO: Maximo 3 paragrafos curtos. Direto ao ponto.
5. TOM: Link seguro = confirmacao tranquila. Link perigoso = firme e calmo, orientando acao concreta. Nunca alarmista sem razao.
6. BRASIL: Mencione PIX, Banco Central, PROCON, Policia Federal, CERT.br quando relevante.`;
    const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,system,messages:[...convHistory,{role:"user",content:question}]})});
    if(!resp.ok){const err=await resp.json().catch(()=>({}));throw new Error(err.error?.message||`HTTP ${resp.status}`)}
    const data=await resp.json();
    const text=data.content?.find(b=>b.type==="text")?.text;
    if(!text)throw new Error("Resposta vazia");
    return text;
  }

  function fallback(q,a){
    const ql=q.toLowerCase();
    const hasLink=a&&a.level!=="empty";
    if(!hasLink)return"🛡️ Cole um link na barra do teclado para que eu possa analisar em detalhes.";
    const cat=(a.info?.categoria||"").toLowerCase();
    const obs0=a.info?.observacoes?.[0]||"";
    const obs1=a.info?.observacoes?.[1]||"";
    if(ql.includes("golpe")||ql.includes("como funciona")||ql.includes("tecnica")){
      if(a.info?.tecnicaAtaque)return`Esse golpe usa a tecnica de <strong>${esc(a.info.tecnicaAtaque)}</strong>.<br><br>O objetivo e criar urgencia ou uma oferta irresistivel para que a vitima entregue dados sem perceber.${a.info.ultimaCampanhaDetectada?`<br><br>Ultima campanha detectada: ${esc(a.info.ultimaCampanhaDetectada)}.`:""}`;
      return"Esse golpe imita um servico conhecido para roubar seus dados. A pagina parece legitima, mas tudo que voce digitar vai para os criminosos.";
    }
    if(ql.includes("o que fazer")||ql.includes("ja cliquei")||ql.includes("ja inseri")||ql.includes("fiz isso")){
      if(a.level==="danger"){
        if(cat.includes("banc"))return"1 <strong>Ligue para o banco imediatamente</strong> e informe sobre o acesso suspeito.<br>2 Troque a senha do internet banking de outro dispositivo.<br>3 Monitore as transacoes e reporte qualquer movimentacao estranha ao banco.";
        if(cat.includes("pix")||cat.includes("financeiro"))return"1 <strong>Contate seu banco agora</strong> — o PIX pode ter prazo para contestacao (ate 80 dias em alguns casos).<br>2 Registre Boletim de Ocorrencia em delegaciaeletronica.gov.br.<br>3 Denuncie ao CERT.br (cert.br/contato).";
        if(cat.includes("social")||cat.includes("mensageria"))return"1 <strong>Troque sua senha agora</strong> de outro dispositivo.<br>2 Ative autenticacao em dois fatores.<br>3 Revise sessoes ativas e encerre as desconhecidas.<br>4 Avise seus contatos — podem receber mensagens falsas em seu nome.";
        return"Nao insira mais dados. Troque as senhas dos servicos acessados. Se passou dados bancarios, contate o banco imediatamente.";
      }
      return"Se apenas clicou sem inserir dados, provavelmente esta seguro. Fique atento a comportamentos estranhos no celular.";
    }
    if(ql.includes("denunci")||ql.includes("reportar")||ql.includes("avisar"))
      return"Para denunciar golpes no Brasil:<br>• <strong>CERT.br</strong>: cert.br/contato<br>• <strong>Google</strong>: safebrowsing.google.com/safebrowsing/report_phish/<br>• <strong>Policia Federal</strong>: delegaciaeletronica.gov.br<br>• <strong>Banco Central</strong>: bcb.gov.br (golpes financeiros)";
    if(a.level==="safe")return`✅ <strong>${esc(a.info?.nome||a.host)}</strong> é confiável. ${obs1?esc(obs1):obs0?esc(obs0):"Verifique o endereço completo antes de inserir dados."} Posso ajudar com mais alguma dúvida?`;
    if(a.level==="danger")return`⛔ Este link é <strong>perigoso</strong>. ${obs0?esc(obs0):"Não clique, não compartilhe e não insira nenhum dado."} Posso explicar como esse golpe funciona ou orientar o que fazer se você já clicou.`;
    if(a.level==="suspicious")return`⚠️ Este link está marcado como <strong>suspeito</strong>. ${obs0?esc(obs0):"Verifique a origem antes de clicar."} Quer que eu explique os sinais de alerta detectados?`;
    return`🔍 <strong>${esc(a.host||a.raw)}</strong> não está na nossa base. Isso não significa que é golpe, mas recomendo cautela. Verifique se há HTTPS e se a fonte é confiável.`;
  }

  function scrollAi(){setTimeout(()=>{if(ipContent)ipContent.scrollTop=ipContent.scrollHeight},30)}
  function addBot(html){const d=document.createElement("div");d.className="ai-bubble ai-bot";d.innerHTML=typeof html==="string"?html.replace(/\n/g,"<br>"):html;aiMsgs.appendChild(d);scrollAi();return d}
  function addUser(t){const d=document.createElement("div");d.className="ai-bubble ai-user";d.textContent=t;aiMsgs.appendChild(d);scrollAi()}
  function addThinking(){const d=document.createElement("div");d.className="ai-bubble ai-bot";d.innerHTML='<div class="ai-dots"><span></span><span></span><span></span></div>';aiMsgs.appendChild(d);scrollAi();return d}

  // Esconde chips quando usuário começa a digitar
  aiInput.addEventListener("input",()=>{
    if(aiInput.value.trim().length>0){
      aiChips.classList.add("hidden");
      if(aiSuggestionsToggle) aiSuggestionsToggle.classList.remove("active");
    }
  });

  // Botão de toggle de sugestões
  if(aiSuggestionsToggle){
    aiSuggestionsToggle.addEventListener("click",()=>{
      const isOpen=!aiChips.classList.contains("hidden");
      if(isOpen){
        aiChips.classList.add("hidden");
        aiSuggestionsToggle.classList.remove("active");
      } else {
        aiChips.classList.remove("hidden");
        aiSuggestionsToggle.classList.add("active");
        // Limpa o input ao abrir sugestões (facilita escolha)
        if(aiInput.value.trim()==="") aiInput.placeholder="Escolha uma sugestão ou digite…";
      }
    });
  }

  aiSendBtn.addEventListener("click",sendAi);
  aiInput.addEventListener("keydown",e=>{if(e.key==="Enter")sendAi()});
});