import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Globe } from "lucide-react";
import { Badge } from "react-bootstrap";

const ComplianceFooter: React.FC = () => {
  return (
    <Card className="rounded-0 border-top-only bg-light">
      <CardContent className="py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3 text-muted small">
                <div className="d-flex align-items-center gap-1">
                  <Shield size={14} className="text-success" />
                  <span>COPPA Compliant</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Lock size={14} className="text-primary" />
                  <span>GDPR-K Protected</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Eye size={14} className="text-info" />
                  <span>No Personal Data Collection</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Globe size={14} className="text-warning" />
                  <span>Safe Educational Content Only</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex gap-2 justify-content-md-end">
                <Badge bg="success" className="small">
                  Child Safe
                </Badge>
                <Badge bg="primary" className="small">
                  Privacy Protected
                </Badge>
                <Badge bg="info" className="small">
                  Parent Controlled
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceFooter;