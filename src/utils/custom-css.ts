export const customCSS = `#documentation-toolbar-button {
    all: unset;
    position: relative;
    color: #FFF;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.15408px;
    padding: 5px 12px;
    border-radius: 80px;
    background: #2962FF;
    cursor: pointer;
  }
  #documentation-toolbar-button:hover {
    background: #1E53E5;
  }
  #documentation-toolbar-button:active {
    background: #1948CC;
  }
  #theme-toggle {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .switcher {
    display: inline-block;
    position: relative;
    flex: 0 0 auto;
    width: 38px;
    height: 20px;
    vertical-align: middle;
    z-index: 0;
    -webkit-tap-highlight-color: transparent;
  }

  .switcher input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
    cursor: default;
  }

  .switcher .thumb-wrapper {
    display: block;
    border-radius: 20px;
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .switcher .track {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-color: #a3a6af;
  }

  #theme-switch:checked + .thumb-wrapper .track {
    background-color: #2962ff;
  }

  .switcher .thumb {
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 14px;
    transition-duration: 250ms;
    transition-property: transform;
    transition-timing-function: ease-out;
    transform: translate(3px, 3px);
    background: #ffffff;
  }

  [dir=rtl] .switcher .thumb {
    transform: translate(-3px, 3px);
  }

  .switcher input:checked + .thumb-wrapper .thumb {
    transform: translate(21px, 3px);
  }

  [dir=rtl] .switcher input:checked + .thumb-wrapper .thumb {
    transform: translate(-21px, 3px);
  }

  #documentation-toolbar-button:focus-visible:before,
  .switcher:focus-within:before {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    border-radius: 16px;
    outline: #2962FF solid 2px;
  }`;