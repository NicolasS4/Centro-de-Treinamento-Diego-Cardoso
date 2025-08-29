// Theme switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeCheckbox = document.getElementById('theme-checkbox');
    const themeLabel = document.querySelector('.theme-switch-label');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        themeCheckbox.checked = true;
        themeLabel.textContent = 'Modo Claro';
    } else {
        themeLabel.textContent = 'Modo Escuro';
    }
    
    // Listen for theme toggle
    themeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Modo Claro';
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Modo Escuro';
        }
    });
});
// Garantir que o rodapé mantenha suas cores independentemente do tema
function enforceFooterColors() {
    const footer = document.querySelector('footer');
    const footerElements = footer.querySelectorAll('*');
    
    // Aplicar cores específicas para o rodapé
    footer.style.backgroundColor = '#000000';
    
    footerElements.forEach(element => {
        if (element.tagName === 'H4' || element.tagName === 'P' || element.tagName === 'A') {
            element.style.color = '#ffffff';
        }
    });
}

// Executar quando o tema for alterado e no carregamento da página
document.addEventListener('DOMContentLoaded', enforceFooterColors);

// Observar mudanças no tema para reaplicar as cores do rodapé
const observer = new MutationObserver(enforceFooterColors);
observer.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['class'] 
});