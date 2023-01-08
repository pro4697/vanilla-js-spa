export default class Component {
  target;

  props;

  state;

  renderCnt;

  constructor(target, props) {
    this.target = target;
    this.props = props;
    this.renderCnt = 0;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {}

  initMounted() {}

  mounted() {}

  template() {
    return '';
  }

  render() {
    this.target.innerHTML = this.template();
    this.renderCnt += 1;
    if (this.renderCnt === 1) {
      this.initMounted();
    } else {
      this.mounted();
    }
  }

  setEvent() {}

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}
