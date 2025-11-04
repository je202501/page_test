import { Modal, Drawer } from 'antd';

const ModalLayout = ({
  isOpen = false,
  closable = false,
  title = null,
  // visible,
  open,
  // okText,
  cancelText = 'Cancel',
  // loading,
  style = {},
  styles = {},
  rootStyle = {},
  width = 1000,
  maxWidth = 1000, // Drawer에서만 적용
  height = '30%',
  top,
  type = 'modal', // ['drawer']
  placement = 'right',
  bodyStyle = {},
  timer,
  footer = null,
  footerStyle = {},
  children,
  onChange = () => {},
  onOk = () => {},
  onCancel = () => {},
  centered = false,
  headerStyle = {},
  zIndex = 1000,
}) => {
  /* 토글 */
  const toggleOnChange = () => {
    if (onChange) onChange(!isOpen);
  };

  /* OK버튼 클릭 시 발생이벤트 */
  const handleOk = () => {
    if (onOk) onOk();
    else toggleOnChange();
  };

  /* 취소버튼 클릭 시 발생이벤트 */
  const handleCancel = () => {
    if (onCancel) onCancel();
    else toggleOnChange();
  };

  /*  */
  // ANCHOR: antd에서 Modal의 visible 사용시 warning 발생, visible -> open으로 수정 (owen)
  const typeView = (type, children) => {
    switch (type) {
      case 'modal':
      case 'Modal':
      case 'MODAL':
        return (
          <Modal
            {...(title && { title })}
            width={width}
            // visible={visible}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText={cancelText}
            {...(top && { style: { top } })}
            {...(style && { style: { top, ...style } })}
            // {...(bodyStyle && { bodyStyle: { ...bodyStyle } })}
            footer={footer}
            footerStyle={footerStyle}
            centered={centered}
            closable={closable}
            zIndex={zIndex}
          >
            {children}
          </Modal>
        );

      case 'drawer':
      case 'Drawer':
      case 'DRAWER':
        return (
          <Drawer
            {...(title && { title })}
            width={width}
            height={height}
            // placement="right"
            closable={closable}
            placement={placement}
            // closable={false}
            onClose={handleCancel}
            // visible={visible}
            open={open}
            rootStyle={{ ...rootStyle }}
            style={{ ...style }}
            styles={{ ...styles }}
            {...(placement === 'left' ||
              (placement === 'right' && { contentWrapperStyle: { maxWidth } }))}
            footer={footer}
            footerStyle={footerStyle}
            headerStyle={headerStyle}
            zIndex={zIndex}
          >
            {children}
          </Drawer>
        );
      default:
        return null;
    }
  };

  /* RENDER */
  return typeView(type, children);
};

export default ModalLayout;
