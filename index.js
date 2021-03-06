'use strict'

const isWin = process.platform === 'win32';
const remote = require('electron').remote;
let dirname = __dirname;

if (isWin == true) {
    dirname = dirname.replace(/\\/g, '/');
}

exports.decorateConfig = (config) => {
    const pluginConfig = Object.assign({
        flipped: true,
    }, config.hyperMacControls);

    const windowControls = config.showWindowControls;

    if (windowControls === false) {
        return config;
    }
	
	if (isWin) return config

    let isLeft = windowControls === 'left';

    return Object.assign({}, config, {
        css: `
            ${config.css || ''}
            .header_windowHeader {
                height: 22px;
                left: ${isLeft ? '57px' : '0'};
                width: calc(100% - 56px);
            }
            .header_windowControls {
                display: none;
            }
            .header_appTitle {
                margin-left: -56px;
            }
            .phx_header {
                position: fixed;
                top: 0;
                ${isLeft ? 'left: 0;' : 'right: 0;'}
                height: 22px;
                width: 56px;
            }
            .phx_actions {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
            }
            .phx_header .phx_close,
            .phx_header .phx_minimize,
            .phx_header .phx_maximize {
                width: 12px;
                height: 12px;
                position: absolute;
                top: 5px;
                border-radius: 0px !important;
                background-position: center;
                background-size: cover !important;
                background-color: transparent !important;
            }
            .phx_header .phx_close {
                background-color: #f25056;
                background-image: url('${dirname}/icons/close.svg');
                left: ${pluginConfig.flipped ? '5px' : '40px'};
            }
            .phx_header .phx_close:hover {
                background-image: url('${dirname}/icons/close_hover.svg');
            }
            .phx_header .phx_minimize {
                background-color: #fac536;
                background-image: url('${dirname}/icons/minimize.svg');
                left: 23px;
            }
            .phx_header .phx_minimize:hover {
                background-image: url('${dirname}/icons/minimize_hover.svg');
            }
            .phx_header .phx_maximize {
                background-color: #39ea49;
                background-image: url('${dirname}/icons/maximize.svg');
                left: ${pluginConfig.flipped ? '40px' : '5px'};
            }
            .phx_header .phx_maximize:hover {
                background-image: url('${dirname}/icons/maximize_hover.svg');
            }
        `
    })
};

exports.decorateHeader = (Hyper, { React }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                window: null,
                maximized: false
            }

            this.closeApp = this.closeApp.bind(this);
            this.minimizeApp = this.minimizeApp.bind(this);
            this.maximizeApp = this.maximizeApp.bind(this);
        }

        closeApp() {
            this.state.window.close();
        }

        minimizeApp() {
            this.state.window.minimize();
            this.state.maximized = false;
        }

        maximizeApp() {
            if (this.state.maximized == true) {
                this.state.window.unmaximize();
                this.state.maximized = false;
            } else {
                this.state.window.maximize();
                this.state.maximized = true;
            }
        }

        render() {
            return (
                React.createElement(Hyper, Object.assign({}, this.props, {
                    customChildren: React.createElement('div', { className: 'phx_header' },
                        React.createElement('div', { className: 'phx_actions' },
                            React.createElement('span', { className: 'phx_close', onClick: this.closeApp }),
                            React.createElement('span', { className: 'phx_minimize', onClick: this.minimizeApp }),
                            React.createElement('span', { className: 'phx_maximize', onClick: this.maximizeApp })
                        )
                    )
                }))
            )
        }

        componentDidMount() {
            this.state.window = remote.getCurrentWindow();
        }
    };
};
