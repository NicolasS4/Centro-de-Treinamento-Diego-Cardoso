// Theme switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeCheckbox = document.getElementById('theme-checkbox');
    const themeLabel = document.querySelector('.theme-switch-label');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Função para atualizar a logo baseada no tema
    function updateLogoForTheme(isDarkTheme) {
        // Selecionar todas as logos (header e footer)
        const mainLogos = document.querySelectorAll('#main-logo, .logo img, .footer-logo img, #footer-logo');
        
        mainLogos.forEach(logo => {
            if (logo && logo.src) {
                try {
                    // Obter o caminho atual da logo
                    const currentSrc = logo.src;
                    
                    // Determinar o diretório base
                    let basePath = '';
                    if (currentSrc.includes('/images/logo/')) {
                        // Encontrar o caminho até /images/logo/
                        const logoIndex = currentSrc.indexOf('/images/logo/');
                        if (logoIndex !== -1) {
                            basePath = currentSrc.substring(0, logoIndex + '/images/logo/'.length);
                        }
                    }
                    
                    // Definir o novo nome do arquivo baseado no tema
                    const newLogoName = isDarkTheme ? 'logo_dark.png' : 'logo.png';
                    
                    // Construir a nova URL
                    if (basePath) {
                        logo.src = basePath + newLogoName;
                    } else {
                        // Fallback: substituir apenas o nome do arquivo
                        if (currentSrc.includes('logo_dark.png')) {
                            logo.src = currentSrc.replace('logo_dark.png', newLogoName);
                        } else if (currentSrc.includes('logo.png')) {
                            logo.src = currentSrc.replace('logo.png', newLogoName);
                        } else {
                            // Se não encontrar os nomes padrão, adicionar o arquivo correto
                            const url = new URL(currentSrc);
                            const pathParts = url.pathname.split('/');
                            pathParts[pathParts.length - 1] = newLogoName;
                            url.pathname = pathParts.join('/');
                            logo.src = url.toString();
                        }
                    }
                } catch (error) {
                    console.error('Erro ao atualizar logo:', error);
                    // Fallback simples
                    if (isDarkTheme) {
                        logo.src = logo.src.replace('logo.png', 'logo_dark.png');
                    } else {
                        logo.src = logo.src.replace('logo_dark.png', 'logo.png');
                    }
                }
            }
        });
    }
    
    // Verificar se a logo dark existe e é carregável
    function checkDarkLogoAvailability() {
        return new Promise((resolve) => {
            const testImg = new Image();
            const darkLogoPath = window.location.pathname.includes('/pages/') 
                ? '../images/logo/logo_dark.png' 
                : 'images/logo/logo_dark.png';
            
            testImg.src = darkLogoPath;
            testImg.onload = () => resolve(true);
            testImg.onerror = () => resolve(false);
            
            // Timeout para não ficar preso
            setTimeout(() => resolve(false), 500);
        });
    }
    
    // Aplicar tema salvo ou preferência do sistema
    async function applyTheme() {
        const shouldUseDarkTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
        
        if (shouldUseDarkTheme) {
            document.body.classList.add('dark-theme');
            if (themeCheckbox) themeCheckbox.checked = true;
            if (themeLabel) themeLabel.textContent = 'Modo Claro';
            
            // Verificar se a logo dark está disponível antes de trocar
            const darkLogoAvailable = await checkDarkLogoAvailability();
            if (darkLogoAvailable) {
                updateLogoForTheme(true);
            }
        } else {
            if (themeLabel) themeLabel.textContent = 'Modo Escuro';
            updateLogoForTheme(false);
        }
    }
    
    // Aplicar tema inicial
    applyTheme();
    
    // Listen for theme toggle
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', async function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                if (themeLabel) themeLabel.textContent = 'Modo Claro';
                
                // Verificar se a logo dark está disponível
                const darkLogoAvailable = await checkDarkLogoAvailability();
                if (darkLogoAvailable) {
                    updateLogoForTheme(true);
                }
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                if (themeLabel) themeLabel.textContent = 'Modo Escuro';
                updateLogoForTheme(false);
            }
        });
    }
    
    // Função para forçar cores do rodapé
    function enforceFooterColors() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        // Aplicar cores específicas para o rodapé
        footer.style.backgroundColor = '#000000';
        footer.style.color = '#ffffff';
        
        // Elementos específicos do rodapé
        const footerTitles = footer.querySelectorAll('h4');
        const footerParagraphs = footer.querySelectorAll('p');
        const footerLinks = footer.querySelectorAll('a');
        const footerLists = footer.querySelectorAll('li');
        
        // Aplicar cor branca a todos os textos do rodapé
        [...footerTitles, ...footerParagraphs, ...footerLinks, ...footerLists].forEach(element => {
            element.style.color = '#ffffff';
        });
        
        // Garantir que os links mantenham hover vermelho
        footerLinks.forEach(link => {
            const originalHover = link.onmouseover;
            link.onmouseover = function() {
                this.style.color = '#e30613';
                if (originalHover) originalHover.call(this);
            };
            link.onmouseout = function() {
                this.style.color = '#ffffff';
            };
        });
    }
    
    // Executar quando o tema for alterado e no carregamento da página
    document.addEventListener('DOMContentLoaded', enforceFooterColors);
    
    // Observar mudanças no DOM para garantir que o rodapé mantenha cores
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.attributeName === 'class') {
                enforceFooterColors();
            }
        });
    });
    
    // Observar mudanças no body e no footer
    observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'],
        childList: true,
        subtree: true 
    });
    
    // Garantir que as logos no header não fiquem muito grandes
    function adjustLogoSize() {
        const logos = document.querySelectorAll('.logo img, .footer-logo img');
        logos.forEach(logo => {
            if (logo.naturalWidth > 50 || logo.naturalHeight > 50) {
                logo.style.maxWidth = '50px';
                logo.style.height = 'auto';
            }
        });
    }
    
    // Ajustar tamanho das logos após carregamento
    window.addEventListener('load', adjustLogoSize);
    
    // Monitorar mudanças de tema do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            // Se o usuário não escolheu manualmente, seguir preferência do sistema
            const isDark = e.matches;
            document.body.classList.toggle('dark-theme', isDark);
            if (themeCheckbox) themeCheckbox.checked = isDark;
            if (themeLabel) themeLabel.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
            updateLogoForTheme(isDark);
        }
    });
});

// Garantir que o rodapé mantenha suas cores independentemente do tema
function enforceFooterColors() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Forçar cores do rodapé
    footer.style.backgroundColor = '#000000 !important';
    footer.style.color = '#ffffff !important';
    
    // Selecionar e colorir todos os elementos de texto no rodapé
    const textElements = footer.querySelectorAll('h4, p, a, span, li, div:not(.social-icons a)');
    textElements.forEach(element => {
        element.style.color = '#ffffff !important';
    });
    
    // Exceção para links no hover
    const links = footer.querySelectorAll('a');
    links.forEach(link => {
        // Salvar evento original
        const originalOnMouseOver = link.onmouseover;
        const originalOnMouseOut = link.onmouseout;
        
        link.onmouseover = function(e) {
            this.style.color = '#e30613 !important';
            if (originalOnMouseOver) originalOnMouseOver.call(this, e);
        };
        
        link.onmouseout = function(e) {
            this.style.color = '#ffffff !important';
            if (originalOnMouseOut) originalOnMouseOut.call(this, e);
        };
    });
    
    // Icones sociais
    const socialIcons = footer.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.style.backgroundColor = 'rgba(255, 255, 255, 0.1) !important';
        icon.style.color = '#ffffff !important';
        
        icon.onmouseover = function() {
            this.style.backgroundColor = '#e30613 !important';
            this.style.color = '#ffffff !important';
        };
        
        icon.onmouseout = function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1) !important';
            this.style.color = '#ffffff !important';
        };
    });
}

// Executar a função quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceFooterColors);
} else {
    enforceFooterColors();
}

// Reaplicar cores quando houver mudanças no DOM
const footerObserver = new MutationObserver(enforceFooterColors);
footerObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
});

// Também observar mudanças de classe no body
footerObserver.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['class'] 
});