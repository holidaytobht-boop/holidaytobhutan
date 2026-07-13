'use client'

import { Card, Nav, Tab } from 'react-bootstrap'

export default function AdminEditorCard({
  title,
  tabs,
  defaultActiveKey,
  children,
  className = '',
  headerExtra,
}) {
  if (tabs?.length) {
    const activeKey = defaultActiveKey || tabs[0].key

    return (
      <Card className={`admin-editor-card guide-editor ${className}`.trim()}>
        <Tab.Container defaultActiveKey={activeKey}>
          <Card.Header className="admin-editor-card__header p-0">
            <Nav variant="tabs" className="guide-editor__tabs flex-nowrap overflow-auto">
              {tabs.map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            {headerExtra}
          </Card.Header>
          <Card.Body className="admin-editor-card__body">{children}</Card.Body>
        </Tab.Container>
      </Card>
    )
  }

  return (
    <Card className={`admin-editor-card ${className}`.trim()}>
      {title ? <Card.Header className="admin-editor-card__header">{title}</Card.Header> : null}
      <Card.Body className="admin-editor-card__body">{children}</Card.Body>
    </Card>
  )
}
