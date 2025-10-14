import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCourier, fetchPackagesByCourier } from "../lib/couriers";
import type { CourierDto, Page, PackageDto } from "../types";
import { deleteCourier } from "../lib/couriers";
import { useNavigate } from "react-router-dom";
import CreatePackageForm from "../components/CreatePackageForm";

export default function CourierDetailsPage() {
  const { id } = useParams();
  const courierId = Number(id);
  const [courier, setCourier] = useState<CourierDto | null>(null);
  const [pkgs, setPkgs] = useState<Page<PackageDto> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const size = 10;
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showCreatePkg, setShowCreatePkg] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [c, p] = await Promise.all([
          fetchCourier(courierId),
          fetchPackagesByCourier(courierId, { page, size, sort: "assignedAt,desc" })
        ]);
        setCourier(c);
        setPkgs(p);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (!Number.isNaN(courierId)) load();
  }, [courierId, page]);
  async function onDelete() {
     const ok = window.confirm(`Delete courier "${courier?.name}" (#${courierId})?`);
     if (!ok) return;
     try {
       setDeleting(true);
       await deleteCourier(courierId);
       navigate("/couriers");
     } catch (err: any) {
       alert(err?.response?.data?.message || "Delete failed. The courier might have packages assigned.");
     } finally {
       setDeleting(false);
     }
   }


  return (
    <section>
      <p><Link to="/couriers">← Back to list</Link></p>
      <h2>Courier #{courierId}</h2>

      {error && <p style={{color:"crimson"}}>Error: {error}</p>}
      {loading && <p>Loading…</p>}

      {courier && (
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{border:"1px solid #ddd", padding:12, borderRadius:8, marginBottom:16, flex:1}}>
            <p><b>Name:</b> {courier.name}</p>
            <p><b>Email:</b> {courier.email}</p>
            <p><b>Manager:</b> {courier.managerId ?? "-"}</p>
            <p><b>Last Location:</b> {(courier.lastLat ?? "-")}/{(courier.lastLng ?? "-")}</p>
          </div>
          <div style={{marginLeft:12}}>
            <button onClick={onDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}


      <h3>Packages</h3>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h3 style={{margin:0}}>Packages</h3>
        <button
          type="button"
          onClick={() => setShowCreatePkg((s) => !s)}
        >
          {showCreatePkg ? "Close" : "New Package"}
        </button>
      </div>

      {showCreatePkg && (
        <div style={{marginBottom:16}}>
          <CreatePackageForm
            requiredCourierId={courierId}
            onCreated={() => {

              setPage(0);
            }}
            onCancel={() => setShowCreatePkg(false)}
          />
        </div>
      )}
      {pkgs && (
        <>
          <table width="100%" cellPadding={8} style={{borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#f4f4f4"}}>
                <th align="left">ID</th>
                <th align="left">Tracking</th>
                <th align="left">Status</th>
                <th align="left">Pickup</th>
                <th align="left">Delivery</th>
                <th align="left">Assigned</th>
                <th align="left">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {pkgs.content.map(p => (
                <tr key={p.id} style={{borderTop:"1px solid #eee"}}>
                  <td>{p.id}</td>
                  <td>{p.trackingCode}</td>
                  <td>{p.status}</td>
                  <td>{p.pickupAddress}</td>
                  <td>{p.deliveryAddress}</td>
                  <td>{p.assignedAt ?? "-"}</td>
                  <td>{p.deliveredAt ?? "-"}</td>
                </tr>
              ))}
              {pkgs.content.length === 0 && (
                <tr><td colSpan={7} style={{textAlign:"center", padding:20}}>No packages.</td></tr>
              )}
            </tbody>
          </table>

          <div style={{display:"flex", justifyContent:"space-between", marginTop:12}}>
            <button disabled={page===0} onClick={() => setPage(p => p-1)}>Prev</button>
            <span>Page {pkgs.number + 1} / {pkgs.totalPages || 1} — {pkgs.totalElements} items</span>
            <button disabled={pkgs.number + 1 >= pkgs.totalPages} onClick={() => setPage(p => p+1)}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}
